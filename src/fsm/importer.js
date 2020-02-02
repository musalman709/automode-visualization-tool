import { GraphEditorEdge } from "../model/graphEditorEdge";
import { GraphEditorNode } from "../model/graphEditorNode";
import { FSMParser } from "./fsmparser";
import Graph from "../model/graph";

export class FSMImporter {
    import(graphEditor, input) {
        this.graphEditor = graphEditor;
        const parser = new FSMParser(input);
        this.states = parser.parse();
        this.nstates = this.states.length;
        this.graph = new Graph();
        for (const state of this.states) {
            this.importNode(state);
        }
        this.importEdges();
        return this.graph;
    }
    importNode(state) {
        // define node model and param (only 1 possibility)
        const model = this.graphEditor.getNodeModelById("0");
        const param = this.graphEditor.getNodeParamById("0");
        // define the position of the node
        const position = { x: 100 + (state.index % 2) * 200, y: 100 + Math.floor(state.index / 2) * 200 };
        const node = new GraphEditorNode(position, model, param);
        this.importNodeParams(state, node);
        this.graph.addNode(node);
    }
    importNodeParams(state, node) {
        const type = node.getType();
        if (type.categories.length > 0) {
            // set node category
            const category = type.categories.find(c => c.id === state.behaviour.toString());
            if (category === undefined)
                throw "behaviour number not correct: " + state.behaviour;
            node.setCategory(category);
            // set params
            for (const [pname, pvalue] of state.params) {
                //TODO: check param validity
                node.setParam(pname, pvalue);
            }
        }
    }
    importEdges() {
        for (let i = 0; i < this.states.length; i++) {
            const state = this.states[i];
            for (const transition of state.transitions) {
                this.importEdge(i, transition);
            }
        }
    }
    importEdge(stateIndex, transition) {
        if (transition.endState < 0 || transition.endState >= this.nstates)
            throw `Invalid transition for state ${stateIndex}`;
        const nodes = this.graph.getNodes();
        const startNode = nodes[stateIndex];
        const destNode = nodes[transition.endState];
        const edge = new GraphEditorEdge(startNode, destNode, 
            this.graphEditor.getEdgeModelById("0"), this.graphEditor.getEdgeParamById("0"));
        edge.graphEditor = this.graphEditor;
        this.importEdgeParams(edge, transition);
        if (edge.isValid()) {
            this.graph.addEdge(edge);
        }
    }
    importEdgeParams(edge, transition) {
        const type = edge.getType();
        if (type.categories.length > 0) {
            // set edge category
            const category = type.categories.find(c => c.id === transition.condition.toString());
            if (category === undefined)
                throw "behaviour number not correct: " + transition.condition;
            edge.setCategory(category);
            // set params
            for (const [pname, pvalue] of transition.params) {
                //TODO: check param validity
                edge.setParam(pname, pvalue);
            }
        }
    }
}