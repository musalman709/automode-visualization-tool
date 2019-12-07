import { defaultEdgeModel, defaultEdgeParam } from "../elementmodels_default";

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