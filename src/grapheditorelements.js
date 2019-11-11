import { defaultNodeModel, defaultNodeParam, defaultEdgeModel, defaultEdgeParam } from "./elementmodels_default";
import { createSVGElement, points_sum } from "./graph_utils";

/**
 * Node and edges objects
 */
export class GraphEditorNode{
    constructor(id, pos) {
        this.id = id;
        // egdes
        this.incomingEdges = [];
        this.outgoingEdges = [];
        // model and parameters
        this.model = defaultNodeModel();
        this.param = defaultNodeParam();
        this.paramdict = {};
        this.paramcontainer = undefined;
        // graphics
        this.pos = { x: 0, y: 0 };
        this.g = createSVGElement("g", { id: this.id });
        this.frame = undefined;
        this.text = undefined;
        this.buildSVGElements();
        this.move(pos);
    }
    buildSVGElements() {
        this.frame = createSVGElement(this.model.display_tag, this.model.display_opts);
        this.text = createSVGElement("text", this.model.display_text_opts);
        this.text.html(this.model.display_text);
        this.g.append(this.frame);
        this.g.append(this.text);
        this.onSelect();
    }
    getName() {
        return this.id;
    }
    isNode() {
        return true;
    }
    getSVGElement() {
        return this.g;
    }
    setModel(model) {
        var pos = this.getPosition();
        var selected = this.frame.hasClass("selected");
        this.model = model;
        if (this.model === undefined) {
            this.model = defaultNodeModel();
        }
        // remove edges if there's too much
        while (this.model.max_incoming_edges >= 0 &&
      this.incomingEdges.length > this.model.max_incoming_edges) {
            this.incomingEdges[0].onRemoval();
        }
        while (this.model.max_outgoing_edges >= 0 &&
      this.outgoingEdges.length > this.model.max_outgoing_edges) {
            this.outgoingEdges[0].onRemoval();
        }
        // remake frame
        this.frame.remove();
        this.text.remove();
        this.buildSVGElements();
        if (selected) {
            this.frame.addClass("selected");
        }
        this.move(pos);
    }
    getModel() {
        return this.model;
    }
    setParam(param) {
        if (param === undefined) {
            this.param = defaultNodeParam();
        }
        else {
            this.param = param;
        }
        this.paramdict = {};
        // A node model can have no parameters
        // If it have, set default values
        if (this.param.categories.length > 0) {
            this.setParamValue(this.param.categoryid, this.param.categories[0].id);
        }
    }
    getParam() {
        return this.param;
    }
    setParamValue(param, value) {
        this.paramdict[param] = value;
        if (param == this.param.categoryid) {
            this.paramdict = {};
            this.paramdict[this.param.categoryid] = value;
            // category change, reset dict with new set of parameters
            var pdict = this.paramdict;
            var that = this;
            this.param.categories.forEach(function (c) {
                if (c.id == value) {
                    c.param.forEach(function (p) {
                        pdict[p.id] = p.min;
                    });
                    that.category = c;
                    // Update displayed label
                    if (c.hasOwnProperty("display_name")) {
                        that.text.html(c.display_name);
                    }
                    else {
                        that.text.html(that.model.display_text);
                    }
                }
            });
        }
    }
    getParamDict() {
        return this.paramdict;
    }
    move(newPos) {
        this.pos = newPos;
        this.g.attr("transform", "translate(" + newPos.x.toString() + "," + newPos.y.toString() + ")");
        this.incomingPos = points_sum(this.model.incoming_point, newPos);
        this.outgoingPos = points_sum(this.model.outgoing_point, newPos);
        this.updateEdges();
    }
    getPosition() {
        return this.pos;
    }
    onSelect() {
        this.frame.addClass("selected");
    }
    onDeselect() {
        this.frame.removeClass("selected");
    }
    onRemoval() {
    // delete edges before delete node
        while (this.incomingEdges.length > 0) {
            this.incomingEdges[0].onRemoval();
        }
        while (this.outgoingEdges.length > 0) {
            this.outgoingEdges[0].onRemoval();
        }
        this.getSVGElement().remove();
        this.graphEditor.removeElement(this);
    }
    getIncomingPoint() {
        return this.incomingPos;
    }
    getOutgoingPoint() {
        return this.outgoingPos;
    }
    canHaveMoreIncomingEdges() {
        return this.model.max_incoming_edges < 0 ||
      (this.model.max_incoming_edges - this.incomingEdges.length > 0);
    }
    addIncomingEdge(edge) {
        if (edge instanceof GraphEditorEdge && this.canHaveMoreIncomingEdges()) {
            this.incomingEdges.add(edge);
            return true;
        }
        return false;
    }
    removeIncomingEdge(edge) {
        this.incomingEdges.remove(edge);
    }
    getIncomingEdges() {
        return this.incomingEdges;
    }
    canHaveMoreOutgoingEdges() {
        return this.model.max_outgoing_edges < 0 ||
      (this.model.max_outgoing_edges - this.outgoingEdges.length > 0);
    }
    addOutgoingEdge(edge) {
        if (edge instanceof GraphEditorEdge && this.canHaveMoreOutgoingEdges()) {
            this.outgoingEdges.add(edge);
            return true;
        }
        return false;
    }
    removeOutgoingEdge(edge) {
        this.outgoingEdges.remove(edge);
    }
    getOutgoingEdges() {
        return this.outgoingEdges;
    }
    updateEdges() {
        for (let i = 0; i < this.incomingEdges.length; ++i) {
            this.incomingEdges[i].update();
        }
        for (let i = 0; i < this.outgoingEdges.length; ++i) {
            this.outgoingEdges[i].update();
        }
    }
}




/**
 * Bind two nodes ('src' and 'dest')
 */
export class GraphEditorEdge{
    /**
     * @param {string} id 
     * @param {GraphEditorNode} srcElement 
     * @param {GraphEditorNode} destElement 
     */
    constructor(id, srcElement, destElement) {
        // src and dest
        this.srcElement = undefined;
        this.destElement = undefined;
        this.id = id;
        // model and parameters
        this.model = defaultEdgeModel();
        this.param = defaultEdgeParam();
        this.paramdict = {};
        this.paramcontainer = undefined;
        // bind src and dest
        if (srcElement.canHaveMoreOutgoingEdges() && destElement.canHaveMoreIncomingEdges()) {
            this.srcElement = srcElement;
            this.destElement = destElement;
            this.g = createSVGElement("g", { id: this.id });
            this.line = undefined;
            this.buildSVGElements();
        }
    }
    buildSVGElements() {
        this.line = createSVGElement("line", { class: this.model.display_opts, stroke: "black", "marker-end": "url(#arrowhead)" });
        this.g.append(this.line);
        this.srcElement.addOutgoingEdge(this);
        this.destElement.addIncomingEdge(this);
        this.onSelect();
        this.update();
    }
    isValid() {
        return this.srcElement !== undefined && this.destElement !== undefined;
    }
    getName() {
        return this.id;
    }
    isNode() {
        return false;
    }
    getSVGElement() {
        return this.g;
    }
    setModel(model) {
        var selected = this.line.hasClass("selected");
        this.model = model;
        if (this.model === undefined) {
            this.model = defaultEdgeModel();
        }
        this.line.remove();
        this.buildSVGElements();
        if (selected) {
            this.line.addClass("selected");
        }
        this.update();
    }
    getModel() {
        return this.model;
    }
    setParam(param) {
        if (param === undefined) {
            this.param = defaultEdgeParam();
        }
        else {
            this.param = param;
        }
        this.paramdict = {};
        // A node model can have no parameters
        // If it have, set default values
        if (this.param.categories.length > 0) {
            this.setParamValue(this.param.categoryid, this.param.categories[0].id);
        }
    }
    getParam() {
        return this.param;
    }
    setParamValue(param, value) {
        this.paramdict[param] = value;
        if (param == this.param.categoryid) {
            this.paramdict = {};
            this.paramdict[this.param.categoryid] = value;
            // category change, reset dict with new set of parameters
            var pdict = this.paramdict;
            this.param.categories.forEach(function (c) {
                if (c.id == value) {
                    c.param.forEach(function (p) {
                        pdict[p.id] = p.min;
                    });
                }
            });
        }
    }
    getParamDict() {
        return this.paramdict;
    }
    move() {
        this.update();
    }
    getPosition() {
        return { x: this.line.attr("x1"), y: this.line.attr("y1") };
    }
    update() {
    // move arrow when src or dest moved
        this.line.attr("x1", this.srcElement.outgoingPos.x);
        this.line.attr("y1", this.srcElement.outgoingPos.y);
        this.line.attr("x2", this.destElement.incomingPos.x);
        this.line.attr("y2", this.destElement.incomingPos.y);
    }
    onSelect() {
        this.line.addClass("selected");
    }
    onDeselect() {
        this.line.removeClass("selected");
    }
    onRemoval() {
        this.srcElement.removeOutgoingEdge(this);
        this.destElement.removeIncomingEdge(this);
        this.getSVGElement().remove();
        this.graphEditor.removeElement(this);
    }
    getSrcNode() {
        return this.srcElement;
    }
    getDestNode() {
        return this.destElement;
    }
}