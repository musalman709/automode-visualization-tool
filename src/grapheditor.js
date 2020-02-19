import { GraphEditorNode } from "./model/graphEditorNode";
import { GraphEditorEdge } from "./model/graphEditorEdge";
import Graph from "./model/graph";
import createExporter from "./exporters";
import createImporter from "./importers";
import btreeNodeModels from "./btree/nodemodels.json";
import btreeEdgeModels from "./btree/edgemodels.json";
import btreeNodeParams from "./btree/nodeparams.json";
import btreeEdgeParams from "./btree/edgeparams.json";
import fsmNodeModels from "./fsm/nodemodels.json";
import fsmEdgeModels from "./fsm/edgemodels.json";
import fsmNodeParams from "./fsm/nodeparams.json";
import fsmEdgeParams from "./fsm/edgeparams.json";

/**
 * Object that manages tools and graph elements,
 * create the svg area and receive input from the user
 */
export default class GraphEditor {
    constructor() {
        this.listeners = [];
        // models lists
        this.nodemodels = [];
        this.nodeparams = [];
        this.edgemodels = [];
        this.edgeparams = [];
        // graph
        this.graph = new Graph();
        this.selectedElement = undefined;
        //mode
        this.setMode("fsm");
        this.createGraph();
    }
    addListener(listener) {
        this.listeners.push(listener);
    }
    removeListener(listener) {
        let index = this.listeners.indexOf(listener);
        if (index !== -1) this.listeners.splice(index, 1);
    }
    notify(event) {
        for (const l of this.listeners) {
            const handler = l[event];
            if (typeof(handler) === "function")
                handler();
        }
    }
    createGraph() {
        // Initialisation function
        this.updateGraph();
    }
    getNodeModels() {
        return this.nodemodels;
    }
    getNodeModelById(id) {
        var model = undefined;
        this.nodemodels.forEach(function (m) {
            if (m.id == id) {
                model = m;
            }
        });
        return model;
    }
    getNodeParams() {
        return this.nodeparams;
    }
    getNodeParamById(id) {
        var param = undefined;
        this.nodeparams.forEach(function (p) {
            if (p.nodeid == id) {
                param = p;
            }
        });
        return param;
    }
    getEdgeModelById(id) {
        var model = undefined;
        this.edgemodels.forEach(function (m) {
            if (m.id == id) {
                model = m;
            }
        });
        return model;
    }
    getEdgeModels() {
        return this.edgemodels;
    }
    getEdgeParamById(id) {
        var param = undefined;
        this.edgeparams.forEach(function (p) {
            if (p.edgeid == id) {
                param = p;
            }
        });
        return param;
    }
    getEdgeParams() {
        return this.edgeparams;
    }
    addNode(position) {
        const node = new GraphEditorNode(position, 
            this.getNodeModelById("0"), this.getNodeParamById("0"));
        this.graph.addNode(node);
        this.callExporter();
        this.setSelectedElement(node);
    }
    addEdge(srcElement, destElement) {
        // create edge
        const edge = new GraphEditorEdge(srcElement, destElement, 
            this.getEdgeModelById("0"), this.getEdgeParamById("0"));
        // if edge valid, add it
        if (edge.isValid()) {
            this.graph.addEdge(edge);
            this.callExporter();
            this.setSelectedElement(edge);
        }
    }
    setFirstElement(newFirst) {
        this.graph.setFirstNode(newFirst);
        this.callExporter();
    }
    removeElement(element) {
        if (element instanceof GraphEditorNode) {
            this.graph.removeNode(element);
        } else if (element instanceof GraphEditorEdge) {
            this.graph.removeEdge(element);
        }
        if (this.selectedElement === element)
            this.setSelectedElement(undefined);
        this.callExporter();
    }
    getElements() {
        return {nodes: this.graph.getNodes(), edges: this.graph.getEdges(), 
            selected: this.selectedElement};
        //return [...this.graph.getNodes(), ...this.graph.getEdges()];
    }
    getCmdline() {
        return this.cmdline;
    }
    setCmdline(cmdline) {
        this.cmdline = cmdline;
        this.notify("cmdlineChange");
    }
    clearElements() {
        this.graph = new Graph();
        this.callExporter();
        this.updateGraph();
    }
    setSelectedElement(element) {
        this.selectedElement = element;
        this.updateGraph();
    }
    getSelectedElement() {
        return this.selectedElement;
    }
    setSelectionModel(modelId) {
        const element = this.getSelectedElement();
        if (element.isNode()) {
            element.setModel(this.getNodeModelById(modelId));
            element.setType(this.getNodeParamById(modelId));
        } else {
            element.setModel(this.getEdgeModelById(modelId));
            element.setType(this.getEdgeParamById(modelId));
        }
        this.callExporter();
    }
    setSelectionCategory(categoryId) {
        const element = this.getSelectedElement();
        const type = this.selectedElement.getType();
        if (type.categoryid !== undefined && categoryId !== undefined)
            element.setCategory(type.categories.find(c => c.id === categoryId));
        this.callExporter();
    }
    setSelectionParam(paramId, value) {
        const element = this.getSelectedElement();
        element.setParam(paramId, value);
        this.callExporter();
    }
    callExporter() {
        const exporter = createExporter(this.mode);
        try {
            this.setCmdline(exporter.export(this.graph));
        } catch (err) {
            this.setCmdline(err);
        }
    }
    updateGraph() {
        this.notify("elementsChange");
    }
    callImporter(cmdlineString) {
        const importer = createImporter(this.mode);
        try {
            const newGraph = importer.import(this, cmdlineString);
            this.clearElements();
            this.graph = newGraph;
            this.updateGraph();
            // clean cmdline
            this.callExporter();
        } catch (err) {
            alert(err);
        }
    }
    getMode() {
        return this.mode;
    }
    setMode(mode) {
        if (this.mode === mode) return;
        switch (mode) {
        case "fsm":
            this.mode = "fsm";
            this.nodemodels = fsmNodeModels;
            this.edgemodels = fsmEdgeModels;
            this.nodeparams = fsmNodeParams;
            this.edgeparams = fsmEdgeParams;
            break;
        case "btree":
            this.mode = "btree";
            this.nodemodels = btreeNodeModels;
            this.edgemodels = btreeEdgeModels;
            this.nodeparams = btreeNodeParams;
            this.edgeparams = btreeEdgeParams;
            break;
        default:
            throw new Error("Wrong mode selected");
        }
        this.clearElements();
        this.notify("modeChange");
    }
}