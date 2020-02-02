import { GraphEditorEdge } from "./graphEditorEdge";
/**
 * Node and edges objects
 */
export class GraphEditorNode {
    constructor(position, model, type) {
        // edges
        this.incomingEdges = [];
        this.outgoingEdges = [];
        // model and parameters
        this.setModel(model);
        this.setType(type);
        // graphics
        this.move(position || { x: 0, y: 0 });
    }
    isNode() {
        return true;
    }
    setModel(model) {
        this.model = model;
        // remove edges if there are too many
        while (this.model.max_incoming_edges >= 0 &&
            this.incomingEdges.length > this.model.max_incoming_edges) {
            this.incomingEdges[0].remove();
        }
        while (this.model.max_outgoing_edges >= 0 &&
            this.outgoingEdges.length > this.model.max_outgoing_edges) {
            this.outgoingEdges[0].remove();
        }
    }
    getModel() {
        return this.model;
    }
    setType(type) {
        this.type = type || {nodeid: "-1", categoryid: "d", categories: []};
        this.params = new Map();
        // A node model can have no parameters
        // If it have, set default values
        if (this.type.categories.length > 0) {
            this.setCategory(this.type.categories[0]);
        }
        else {
            this.category = undefined;
        }
    }
    getType() {
        return this.type;
    }
    setCategory(category) {
        // check the category is valid for the type of the node
        if (!category || !this.type.categories.includes(category))
            throw new Error("Invalid category");
        this.category = category;
        // set default values for all params in the new category
        this.params = new Map();
        for (const p of category.param) {
            this.params.set(p.id, p.min);
        }
    }
    getCategory() {
        return this.category;
    }
    setParam(param, value) {
        this.params.set(param, value);
    }
    getParams() {
        return this.params;
    }
    setGraph(graph) {
        this.graph = graph;
    }
    move(newposition) {
        this.position = newposition;
    }
    getPosition() {
        return this.position;
    }
    remove() {
        // delete edges before deleting node
        while (this.incomingEdges.length > 0) {
            this.incomingEdges[0].remove();
        }
        while (this.outgoingEdges.length > 0) {
            this.outgoingEdges[0].remove();
        }
        if (this.graph) this.graph.removeNode(this);
    }
    canHaveMoreIncomingEdges() {
        return this.model.max_incoming_edges < 0 ||
            (this.model.max_incoming_edges - this.incomingEdges.length > 0);
    }
    addIncomingEdge(edge) {
        if (edge instanceof GraphEditorEdge && this.canHaveMoreIncomingEdges()) {
            if (!this.incomingEdges.includes(edge)) this.incomingEdges.push(edge);
            return true;
        }
        return false;
    }
    removeIncomingEdge(edge) {
        let index = this.incomingEdges.indexOf(edge);
        if (index > -1)
            this.incomingEdges.splice(index, 1);
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
            if (!this.outgoingEdges.includes(edge)) this.outgoingEdges.push(edge);
            return true;
        }
        return false;
    }
    removeOutgoingEdge(edge) {
        let index = this.outgoingEdges.indexOf(edge);
        if (index > -1)
            this.outgoingEdges.splice(index, 1);
    }
    getOutgoingEdges() {
        return this.outgoingEdges;
    }
}