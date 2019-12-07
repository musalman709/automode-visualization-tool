import { defaultNodeModel, defaultNodeParam } from "../elementmodels_default";
import { GraphEditorEdge } from "./graphEditorEdge";
/**
 * Node and edges objects
 */
export class GraphEditorNode {
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
        }
        else {
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
