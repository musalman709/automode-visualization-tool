import GraphEditorExporter from "../GraphEditorExporter";

export class FSMExporter extends GraphEditorExporter{
    export(elements) {
        // If elements empty, set empty string
        if (elements.length === 0) {
            return "";
        }
        // Get the number of states
        const nbS = this.findNbStates(elements);
        // build string 
        var str = this.expStates(nbS, elements);
        return str;
    }
    findNbStates(elements) {
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
    expStates(nbS, elements) {
        var str = "--fsm-config ";
        str += "--nstates " + nbS + " ";
        var nodeCounter = 0;
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].isNode()) {
                str += this.expNodeParams(elements[i], nodeCounter);
                str += this.expTransitions(elements, i, nodeCounter);
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
    expTransitions(elements, i, nodeCounter) {
        var str = "";
        const node = elements[i];
        if (node.getOutgoingEdges().length > 0) {
            str += "--n" + nodeCounter + " " + node.getOutgoingEdges().length + " ";
            let target;
            for (var j = 0; j < node.getOutgoingEdges().length; j++) {
                target = this.getNodeNumber(node.getOutgoingEdges()[j].getDestNode(), elements);
                if (target > nodeCounter)
                    target--;
                else if (target === nodeCounter)
                    throw new Error("A node cannot have a transition to itself");
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










