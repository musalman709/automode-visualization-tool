import { defaultNodeModel, defaultNodeParam, defaultEdgeModel, defaultEdgeParam } from "./elementmodels_default";
import { points_sum } from "./graph_utils";

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
        this.move(pos);
    }
    getName() {
        return this.id;
    }
    isNode() {
        return true;
    }
    setModel(model) {
        var pos = this.getPosition();
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
        } else {
            this.category = undefined;
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
                }
            });
        }
    }
    getParamDict() {
        return this.paramdict;
    }
    move(newPos) {
        this.pos = newPos;
        this.incomingPos = points_sum(this.model.incoming_point, newPos);
        this.outgoingPos = points_sum(this.model.outgoing_point, newPos);
    }
    getPosition() {
        return this.pos;
    }
    onRemoval() {
    // delete edges before delete node
        while (this.incomingEdges.length > 0) {
            this.incomingEdges[0].onRemoval();
        }
        while (this.outgoingEdges.length > 0) {
            this.outgoingEdges[0].onRemoval();
        }
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
            this.srcElement.addOutgoingEdge(this);
            this.destElement.addIncomingEdge(this);
            // set default position
            this.move({x: (this.srcElement.getPosition().x + this.destElement.getPosition().x)/2,
                y: (this.srcElement.getPosition().y + this.destElement.getPosition().y)/2});
        }
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
    setModel(model) {
        this.model = model;
        if (this.model === undefined) {
            this.model = defaultEdgeModel();
        }
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
    move(newPosition) {
        this.position = newPosition;
    }
    onRemoval() {
        this.srcElement.removeOutgoingEdge(this);
        this.destElement.removeIncomingEdge(this);
        this.graphEditor.removeElement(this);
    }
    getSrcNode() {
        return this.srcElement;
    }
    getDestNode() {
        return this.destElement;
    }
}