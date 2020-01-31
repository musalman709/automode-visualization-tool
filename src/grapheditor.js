import GraphEditorTool from "./tools/graphEditorTool";
import SVGElements from "./view/SVGElements.jsx";
import { h, render } from "preact";
import { GraphEditorNode } from "./model/graphEditorNode";
import { GraphEditorEdge } from "./model/graphEditorEdge";

/**
 * Object that manages tools and graph elements,
 * create the svg area and receive input from the user
 */
export default class GraphEditor {
    constructor() {
        // event handlers
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        // html elements
        this.toolscontainer = document.querySelector("#tools-container");
        // import / export
        this.exporter = undefined;
        this.importer = undefined;
        // svg html element
        this.svg = document.querySelector("#graph");
        // models lists
        this.nodemodels = [];
        this.nodeparams = [];
        this.edgemodels = [];
        this.edgeparams = [];
        // graph elements
        this.elements = [];
        // tools
        this.tools = [];
        this.defaultTool = undefined;
        this.currentTool = undefined;
        this.selectedElement = undefined;
        this.createGraph();
        // events
        this.svg.addEventListener("mousedown", e => this.onMouseDown(e));
        this.svg.addEventListener("mouseup", e => this.onMouseUp(e));
        this.svg.addEventListener("mouseleave", e => this.onMouseLeave(e));
        this.svg.addEventListener("mousemove", e => this.onMouseMove(e));
        this.svg.addEventListener("selectstart", e=> e.preventDefault());
        //mode
        this.mode = "";
    }
    createGraph() {
        // Initialisation function
        this.clearTools();
        this.updateGraph();
    }
    width() {
        return this.svg.getBoundingClientRect().width;
    }
    height() {
        return this.svg.getBoundingClientRect().height;
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
    addElement(element) {
        this.elements.push(element);
        element.graphEditor = this;
        this.callExporter();
    }
    addNode(position) {
        const node = new GraphEditorNode("rd_node", position, 
            this.getNodeModelById("0"), this.getNodeParamById("0"));
        this.addElement(node);
        this.setSelectedElement(node);
    }
    addEdge(srcElement, destElement) {
        // create edge
        const edge = new GraphEditorEdge("rd_edge", srcElement, destElement, 
            this.getEdgeModelById("0"), this.getEdgeParamById("0"));
        // if edge valid, add it
        if (edge.isValid()) {
            this.addElement(edge);
            this.setSelectedElement(edge);
        }
    }
    setFirstElement(newFirst) {
        let index;
        if (newFirst && (index = this.elements.indexOf(newFirst)) > -1) {
            [this.elements[0], this.elements[index]] = [this.elements[index], this.elements[0]];
            this.callExporter(newFirst);
        }
    }
    removeElement(element) {
        let index = this.elements.indexOf(element);
        if (index > -1) {
            this.elements.splice(index, 1);
            element.onRemoval();
            if (this.selectedElement === element) {
                this.setSelectedElement(undefined);
            }
            this.callExporter();
        }
    }
    getElements() {
        return this.elements;
    }
    clearElements() {
        // Not the most efficient but we are sur that all elements
        // are deleted properly
        while (this.elements.length > 0) {
            this.removeElement(this.elements[this.elements.length - 1]);
        }
        this.updateGraph();
    }
    setSelectedElement(element) {
        this.selectedElement = element;
        this.updateParamPane();
        this.updateGraph();
    }
    getSelectedElement() {
        return this.selectedElement;
    }
    updateParamPane() {
        const paramPane = document.querySelector("param-pane");
        if (this.selectedElement !== undefined) {
            //model select
            var modelsArray = undefined;
            // get the models
            if (this.selectedElement.isNode()) {
                modelsArray = this.getNodeModels();
            } else {
                modelsArray = this.getEdgeModels();
            }
            paramPane.setModels(modelsArray, this.selectedElement.getModel());
            // parameter elements
            const element = this.selectedElement;
            const type = element.getType();
            const category = element.getCategory();
            paramPane.setCategories(type.categories, type.categoriesname, category);
            if (category)
                paramPane.setParams(category.param, element.getParams());
            else
                paramPane.clearParams();
        } else {
            paramPane.clear();
        }
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
        this.updateParamPane();
        this.callExporter();
    }
    setSelectionCategory(categoryId) {
        const element = this.getSelectedElement();
        const type = this.selectedElement.getType();
        if (type.categoryid !== undefined && categoryId !== undefined)
            element.setCategory(type.categories.find(c => c.id === categoryId));
        this.updateParamPane();
        this.callExporter();
    }
    setSelectionParam(paramId, value) {
        const element = this.getSelectedElement();
        element.setParam(paramId, value);
        this.updateParamPane();
        this.callExporter();
    }
    addTool(tool, isdefault = false) {
        if (tool instanceof GraphEditorTool) {
            this.tools.push(tool);
            tool.graphEditor = this;
            var graphEditor = this;
            const element = document.createElement("p");
            element.className = "tool";
            element.id = `tool_${tool.getToolId()}`;
            element.appendChild(document.createTextNode(tool.getName()));
            element.addEventListener("click", () => {
                graphEditor.setCurrentTool(tool);
            });
            this.toolscontainer.appendChild(element);
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
            const currentToolTag = document.querySelector(`#tool_${this.currentTool.getToolId()}`);
            currentToolTag.setAttribute("class", "tool");
            this.currentTool.onToolDeselect();
        }
        this.currentTool = tool;
        if (this.currentTool == undefined) {
            this.currentTool = this.defaultTool;
        }
        if (this.currentTool !== undefined) {
            const currentToolTag = document.querySelector(`#tool_${this.currentTool.getToolId()}`);
            currentToolTag.setAttribute("class", "tool selected");
            this.currentTool.onToolSelect();
        }
    }
    clearTools() {
        this.setCurrentTool(undefined);
        this.setDefaultTool(undefined);
        this.tools = [];
        const tc = this.toolscontainer;
        while (tc.firstChild)
            tc.removeChild(tc.firstChild);
    }
    SVGCoordFromHTML(x, y) {
        var svgPt = this.svg.createSVGPoint();
        svgPt.x = x;
        svgPt.y = y;
        svgPt = svgPt.matrixTransform(this.svg.getScreenCTM().inverse());
        return svgPt;
    }
    onMouseDown(e, element) {
        if (this.currentTool !== undefined) {
            var pos = this.SVGCoordFromHTML(e.pageX, e.pageY);
            this.currentTool.onMouseDown(pos, element);
        }
    }
    onMouseUp(e) {
        if (this.currentTool !== undefined) {
            var pos = this.SVGCoordFromHTML(e.pageX, e.pageY);
            this.currentTool.onMouseUp(pos);
        }
    }
    onMouseLeave() {
        if (this.currentTool !== undefined) {
            this.currentTool.onMouseLeave();
        }
    }
    onMouseMove(e) {
        if (this.currentTool !== undefined) {
            var pos = this.SVGCoordFromHTML(e.pageX, e.pageY);
            this.currentTool.onMouseMove(pos);
        }
    }
    setExporter(exporter) {
        this.exporter = exporter;
    }
    callExporter() {
        this.updateGraph();
        console.log(this.elements);
        if (this.exporter !== undefined) {
            const cmdline = document.querySelector("#cmdline");
            try {
                cmdline.value = this.exporter.export(this.getElements());
            } catch (err) {
                cmdline.value = err;
            }
        }
    }
    updateGraph() {
        render(h(SVGElements, { elements: this.elements, selectedElement: this.selectedElement, handleClick: this.onMouseDown }, null), document.querySelector("#elements-container"));
    }

    setImporter(importer) {
        this.importer = importer;
    }
    callImporter() {
        if (this.importer !== undefined) {
            const cmdlineString = document.querySelector("#cmdline").value;
            this.clearElements();
            try {
                this.importer.import(this, cmdlineString);
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