import { GraphEditorEdge } from "../model/graphEditorEdge";
import { GraphEditorNode } from "../model/graphEditorNode";
import { FSMParser } from "./fsmparser";

export class FSMImporter {
    import(graphEditor, inputString) {
        // build parameters dict
        const parser = new FSMParser(inputString);
        const states = parser.parse();
        this.nstates = states.length;
        graphEditor.clearElements();
        for (const state of states) {
            this.importNode(graphEditor, state); //will import the node and the parameters
        }
        this.importEdges(graphEditor, states);
    }
    importNode(graphEditor, state) {
        var model = graphEditor.getNodeModelById("0"); //there is only one model and one set of parameters for said model
        var param = graphEditor.getNodeParamById("0");
        var node = new GraphEditorNode("imp_node", { x: 100 + (state.index % 2) * 200, y: 100 + Math.floor(state.index / 2) * 200 }, model, param); //placement is defined here
        this.importNodeParams(state, node);
        graphEditor.addElement(node);
        return node;
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
    importEdges(graphEditor, states) {
        for (let i = 0; i < states.length; i++) {
            const state = states[i];
            for (const transition of state.transitions) {
                this.importEdge(graphEditor, i, transition);
            }
        }
    }
    importEdge(graphEditor, stateIndex, transition) {
        if (transition.endState < 0 || transition.endState >= this.nstates)
            throw `Invalid transition for state ${stateIndex}`;
        const startNode = graphEditor.getElements()[stateIndex];
        const destNode = graphEditor.getElements()[transition.endState];
        var edge = new GraphEditorEdge("imp_edge", startNode, destNode, 
            graphEditor.getEdgeModelById("0"), graphEditor.getEdgeParamById("0"));
        edge.graphEditor = graphEditor;
        this.importEdgeParams(edge, transition);
        if (edge.isValid()) {
            graphEditor.addElement(edge);
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