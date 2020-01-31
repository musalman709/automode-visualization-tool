
/**
 * Bind two nodes ('src' and 'dest')
 */
export class GraphEditorEdge{
    /**
     * @param {string} id 
     * @param {GraphEditorNode} srcElement 
     * @param {GraphEditorNode} destElement 
     */
    constructor(id, srcElement, destElement, model, param) {
        // src and dest
        this.srcElement = undefined;
        this.destElement = undefined;
        this.id = id;
        // model and parameters
        this.setModel(model);
        this.setType(param);
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
    }
    getModel() {
        return this.model;
    }
    setType(type) {
        this.type = type || {edgeid: "-1", categoryid: "d", categories: []};
        this.params = {};
        // if the new type has categories, assign the first one to this node
        if (this.type.categories.length > 0) {
            this.setCategory(this.type.categories[0]);
        } else {
            this.category = undefined;
        }
    }
    getType() {
        return this.type;
    }
    setCategory(category) {
        // check the category is valid for the type of the edge
        if (!category || !this.type.categories.includes(category))
            throw new Error("Invalid category");
        this.category = category;
        // set default values for all params in the new category
        this.params = {};
        for (const p of category.param) {
            this.params[p.id] = p.min;
        }
    }
    getCategory() {
        return this.category;
    }
    setParam(param, value) {
        this.params[param] = value;
    }
    getParams() {
        return this.params;
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