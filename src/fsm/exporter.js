import { GraphEditorExporter } from "../grapheditor";

export class FSMExporter extends GraphEditorExporter{
    constructor(outputHTML) {
        super();
        this.outputHTML = outputHTML;
        this.outputHTML.text("");
    }
    setText(text) {
        this.outputHTML.val(text);
    }
    export(graphEditor) {
        try {
            var elements = graphEditor.getElements();
            // If elements empty, set empty string
            if (elements.length === 0) {
                this.setText("");
                return;
            }
            // Get the number of states
            const nbS = this.findNbStates(graphEditor, elements);
            // build string 
            var str = this.expStates(nbS, graphEditor, elements);
            this.setText(str);
        }
        catch (err) {
            this.setText(err);
        }
    }
    findNbStates(graphEditor, elements) {
        var nbS = 0;
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].isNode()) {
                nbS++;
            }
        }
        if (nbS === 0) {
            throw "Invalid configuration : no node found";
        }
        return nbS;
    }
    expStates(nbS, graphEditor, elements) {
        var str = "--fsm-config ";
        str += "--nstates " + nbS + " ";
        var nodeCounter = 0;
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].isNode()) {
                str += this.expNodeParams(elements[i], nodeCounter);
                str += this.expTransitions(graphEditor, elements, i, nodeCounter);
                nodeCounter++;
            }
        }
        return str;
    }
    expNodeParams(node, nodeCounter) {
        var pdict = node.getParamDict();
        var str = "";
        for (var key in pdict) {
            if (pdict.hasOwnProperty(key)) {
                str += "--" + key + nodeCounter + " " + pdict[key] + " ";
            }
        }
        return str;
    }
    expTransitions(graphEditor, elements, i, nodeCounter) {
        var str = "";
        const node = elements[i];
        if (node.getOutgoingEdges().length > 0) {
            str += "--n" + nodeCounter + " " + node.getOutgoingEdges().length + " ";
            let target;
            for (var j = 0; j < node.getOutgoingEdges().length; j++) {
                target = this.getNodeNumber(node.getOutgoingEdges()[j].getDestNode(), elements);
                str += "--n" + nodeCounter + "x" + j + " " + target + " ";
                str += this.expEdgeParams(node.getOutgoingEdges()[j], nodeCounter, j, target);
            }
        }
        return str;
    }
    expEdgeParams(edge, startEdge, edgeNumber, /*destEdge*/) {
        var pdict = edge.getParamDict();
        var str = "";
        for (var key in pdict) {
            if (pdict.hasOwnProperty(key)) {
                str += "--" + key + startEdge + "x" + edgeNumber + " " + pdict[key] + " ";
            }
        }
        return str;
    }
    getIdFromElement(element, elementList) {
        for (let i = 0; i < elementList.length; i++) {
            if (element == elementList[i]) {
                return i;
            }
        }
        return -1;
    }
    getNodeNumber(element, elementList) {
        var counter = 0;
        for (let i = 0; i < elementList.length; i++) {
            if (elementList[i].isNode() && element == elementList[i]) {
                return counter;
            }
            else {
                counter++;
            }
        }
        return -1;
    }
}










