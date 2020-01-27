import { GraphEditorEdge } from "../model/graphEditorEdge";
import { GraphEditorNode } from "../model/graphEditorNode";
import { FSMParser } from "./fsmparser";

/**
 * Iterator over the string tree, extracting one argument at a time
 */
class CmdLineIterator {
    constructor(cmdlinestring) {
        this.args = cmdlinestring.split(" ");
        this.i = 0;
    }
    next() {
        if (this.i >= this.args.length)
            return "";
        while (this.args[this.i] == "") {
            this.i += 1;
            if (this.i >= this.args.length)
                return "";
        }
        var elem = this.args[this.i];
        this.i += 1;
        return elem;
    }
    previous() {
        if (this.i <= 0)
            return "";
        while (this.args[this.i] == "") {
            this.i -= 1;
            if (this.i <= 0)
                return "";
        }
        var elem = this.args[this.i];
        return elem;
    }
    end() {
        return this.i >= this.args.length;
    }
    reset() {
        this.i = 0;
    }
}
export class FSMImporter {
    isStartArg(arg) {
        return arg === "--fsm-config";
    }
    isArg(arg) {
        return arg.substring(0, 2) == "--";
    }
    isValue(arg) {
        return !isNaN(arg);
    }
    isCorrectState(arg, i) {
        return arg == ("--s" + i);
    }
    isCorrectTransition(arg, i) {
        return arg == ("--n" + i);
    }
    import(graphEditor, inputString) {
        // build parameters dict
        console.log("starting to import");
        var iterator = new CmdLineIterator(inputString);
        graphEditor.clearElements();
        var firstArg = iterator.next();
        if (!this.isStartArg(firstArg)) {
            throw "first arg must be --fsm-config and not " + firstArg + ".";
        }
        var secArg = iterator.next();
        if (secArg.localeCompare("--nstates")) {
            throw "second arg must be --nstates and not " + secArg + ".";
        }
        var nbStates = iterator.next();
        if (!this.isValue(nbStates)) {
            throw "the number of states must be a integer you wrote " + nbStates;
        }
        nbStates = Math.round(nbStates); //making sure it is an integer, 2.5 states would not work well
        console.log("basic imports done");
        var state = undefined;
        var behav = undefined;
        for (var i = 0; i < nbStates; i++) { //there must be exaclty nbStates of states definition
            state = iterator.next();
            if (!this.isCorrectState(state, i)) {
                if (!this.isCorrectTransition(state, i - 1)) {
                    throw "the state definition is not correct, please verify it, problem with " + state;
                }
                else {
                    while (!this.isCorrectState(iterator.next(), i));
                    iterator.previous();
                }
            }
            behav = iterator.next();
            this.importNode(graphEditor, behav, i, iterator); //will import the node and the parameters
        }
        console.log("states imported");
        iterator.reset();
        var stateCounter = 0;
        let count = 0;
        while (!iterator.end() || count > 100) { //import the edges
            var nextItem = iterator.next(); // should be of type --nS if there is a transition. the right state number does not need to be verified
            if (!this.isCorrectState(nextItem, stateCounter)) {
                if (this.isCorrectTransition(nextItem, (stateCounter - 1))) {
                    var numberOfEdges = iterator.next(); //this tells us how many edges there is
                    for (let n = 0; n < numberOfEdges; n++) {
                        var startNode = iterator.next()[3]; //needs the A from --nAxB
                        let startNodeObj = graphEditor.getElements()[startNode]; // this works because the first elements to be created are the nodes
                        var destNode = iterator.next();
                        if (destNode >= startNode) {
                            destNode++;
                        }
                        let destNodeObj = graphEditor.getElements()[destNode];
                        console.log("startNode: " + startNode + " destNode: " + destNode);
                        this.importEdges(graphEditor, iterator, startNodeObj, destNodeObj);
                    }
                }
                else { //no transition for that node and we read the privious node to reset the iterator
                }
            }
            else {
                stateCounter++;
            }
            count++;
        }
        console.log("String imported");
        console.log((new FSMParser(inputString)).parse());
    }
    importNode(graphEditor, behav, i, iterator) {
        var model = graphEditor.getNodeModelById("0"); //there is only one model and one set of parameters for said model
        var param = graphEditor.getNodeParamById("0");
        var node = new GraphEditorNode("imp_node", { x: 100 + (i % 2) * 200, y: 100 + Math.floor(i / 2) * 200 }, model, param); //placement is defined here
        this.importNodeParams(behav, node, iterator);
        graphEditor.addElement(node);
        return node;
    }
    importNodeParams(behav, node, iterator) {
        var param = node.getParam();
        if (param.categories.length > 0) {
            // get category
            var category = undefined;
            param.categories.forEach(function (c) {
                if (c.id == behav) {
                    category = c;
                }
            });
            if (category === undefined)
                throw "behaviour number not correct: " + behav;
            // set node category
            node.setParamValue(param.categoryid, behav);
            // get params
            category.param.forEach(function (p) {
                let next = iterator.next();
                let currentParam = next.substring(2, next.length - 1);
                if (p.id == currentParam) { //No verification if the parameter is valid, we assume the value is; could check with the min/max value
                    var value = iterator.next();
                    node.setParamValue(p.id, value);
                }
                else {
                    throw "invalid parameter of node at this place written: " + currentParam;
                }
            });
        }
    }
    importEdges(graphEditor, iterator, startNode, destNode) {
        var condition = iterator.next(); //should be --cAxB
        var transType = iterator.next();
        var edge = new GraphEditorEdge("imp_edge", startNode, destNode, 
            graphEditor.getEdgeModelById("0"), graphEditor.getEdgeParamById("0"));
        edge.graphEditor = graphEditor;
        //edge.setModel(graphEditor.getEdgeModelById("0")); //only one model for the edges
        //edge.setParam(graphEditor.getEdgeParamById("0"));
        this.importEdgeParams(edge, iterator, transType);
        if (edge.isValid()) {
            graphEditor.addElement(edge);
        }
    }
    importEdgeParams(edge, iterator, transType) {
        var param = edge.getParam();
        if (param.categories.length > 0) {
            // get category
            var category = undefined;
            param.categories.forEach(function (c) {
                if (c.id == transType) {
                    category = c;
                }
            });
            if (category === undefined)
                throw "behaviour number not correct: " + transType;
            // set edge category
            edge.setParamValue(param.categoryid, transType);
            // get params
            let currentParam;
            category.param.forEach(function (p) {
                currentParam = iterator.next()[2];
                if (p.id == currentParam) { //No verification if the parameter is valid, we assume it is; could check with the min/max value
                    var value = iterator.next();
                    edge.setParamValue(p.id, value);
                }
                else {
                    throw "invalid parameter of edge at this place written: " + currentParam;
                }
            });
        }
    }
}