import GraphEditorTool from "./tools/graphEditorTool";
import { GraphEditorNode } from "./model/graphEditorNode";
import { GraphEditorEdge } from "./model/graphEditorEdge";
import Graph from "./model/graph";

/**
 * Object that manages tools and graph elements,
 * create the svg area and receive input from the user
 */
export default class GraphEditor {
    constructor() {
        // import / export
        this.exporter = undefined;
        this.importer = undefined;
        // models lists
        this.nodemodels = [];
        this.nodeparams = [];
        this.edgemodels = [];
        this.edgeparams = [];
        // graph
        this.graph = new Graph();
        // tools
        this.tools = [];
        this.defaultTool = undefined;
        this.currentTool = undefined;
        this.selectedElement = undefined;
        //mode
        this.mode = "";
        this.listeners = [];
        this.createGraph();
    }
    subscribe(listener) {
        this.listeners.push(listener);
        listener({nodes: this.graph.getNodes(), edges: this.graph.getEdges(), 
            selected: this.selectedElement, tools: this.tools, selectedTool: this.currentTool});
    }
    unSubscribe(listener) {
        let index = this.listeners.indexOf(listener);
        if (index !== -1) this.listeners.splice(index, 1);
    }
    notify() {
        for (const l of this.listeners) {
            l({nodes: this.graph.getNodes(), edges: this.graph.getEdges(), 
                selected: this.selectedElement, tools: this.tools, selectedTool: this.currentTool});
        }
    }
    createGraph() {
        // Initialisation function
        this.clearTools();
        this.updateGraph();
    }
    setNodeModels(data) {
        this.nodemodels = data;
    }
    setNodeParams(data) {
        this.nodeparams = data;
    }
    setEdgeModels(data) {
        this.edgemodels = data;
    }
    setEdgeParams(data) {
        this.edgeparams = data;
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
        return [...this.graph.getNodes(), ...this.graph.getEdges()];
    }
    clearElements() {
        this.graph = new Graph();
        this.callExporter();
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
    addTool(tool, isdefault = false) {
        if (tool instanceof GraphEditorTool) {
            this.tools.push(tool);
            tool.graphEditor = this;
            if (isdefault) {
                this.setDefaultTool(tool);
            }
        }
    }
    setDefaultTool(tool) {
        if (this.tools.includes(tool)) {
            this.defaultTool = tool;
            if (this.currentTool === undefined) {
                this.setCurrentTool(tool);
            }
        }
        else {
            this.defaultTool = undefined;
        }
    }
    setCurrentTool(tool) {
        if (this.currentTool !== undefined) {
            this.currentTool.onToolDeselect();
        }
        this.currentTool = tool;
        if (this.currentTool == undefined) {
            this.currentTool = this.defaultTool;
        }
        if (this.currentTool !== undefined) {
            this.currentTool.onToolSelect();
        }
        this.notify();
    }
    clearTools() {
        this.setCurrentTool(undefined);
        this.setDefaultTool(undefined);
        this.tools = [];
    }
    SVGCoordFromHTML(x, y) {
        var svgPt = this.svg.createSVGPoint();
        svgPt.x = x;
        svgPt.y = y;
        svgPt = svgPt.matrixTransform(this.svg.getScreenCTM().inverse());
        return svgPt;
    }
    setExporter(exporter) {
        this.exporter = exporter;
    }
    callExporter() {
        this.updateGraph();
        if (this.exporter !== undefined) {
            const cmdline = document.querySelector("#cmdline");
            try {
                cmdline.value = this.exporter.export(this.graph);
            } catch (err) {
                cmdline.value = err;
            }
        }
    }
    updateGraph() {
        this.notify();
    }

    setImporter(importer) {
        this.importer = importer;
    }
    callImporter() {
        if (this.importer !== undefined) {
            const cmdlineString = document.querySelector("#cmdline").value;
            this.clearElements();
            try {
                this.graph = this.importer.import(this, cmdlineString);
                // reset cmdline to proper one
                this.callExporter();
            } catch (err) {
                document.querySelector("#cmdline").value = cmdlineString;
                alert(err);
            }
        }
    }
    getMode() {
        return this.mode;
    }
    setMode(mode) {
        if (mode === "fsm" || mode === "btree") {
            this.mode = mode;
        }
        else {
            throw new Error("Wrong mode selected");
        }
    }
}