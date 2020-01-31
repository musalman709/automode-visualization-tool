
export class FSMExporter{
    export(elements) {
        // if there are no element, return the empty string
        if (elements.length === 0)
            return "";
        this.elements = elements;
        // calculate the number of states
        this.nstates = this.findNbStates();
        // export elements
        this.result = "";
        this.exportElements();
        return this.result;
    }
    exportElements() {
        this.result += "--fsm-config --nstates " + this.nstates + " ";
        let nodeCounter = 0;
        // for each node, export its behaviour, params and transitions
        for (let i = 0; i < this.elements.length; i++) {
            const elem = this.elements[i];
            if (elem.isNode()) {
                this.result += `--s${nodeCounter} ${elem.category.id} `;
                this.exportNodeParams(elem, nodeCounter);
                this.exportNodeTransitions(elem, nodeCounter);
                nodeCounter++;
            }
        }
    }
    exportNodeParams(node, nodeIndex) {
        const params = node.getParams();
        for (const p of Object.keys(params)) {
            this.result += `--${p}${nodeIndex} ${params[p]} `;
        }
    }
    exportNodeTransitions(node, nodeIndex) {
        if (node.getOutgoingEdges().length > 0) {
            // export transitions count
            this.result += "--n" + nodeIndex + " " + node.getOutgoingEdges().length + " ";
            // export transitions
            for (let j = 0; j < node.getOutgoingEdges().length; j++) {
                const transition = node.getOutgoingEdges()[j];
                // find index of transition target
                let targetIndex = this.getNodeIndex(transition.getDestNode());
                if (targetIndex > nodeIndex)
                    targetIndex--;
                else if (targetIndex === nodeIndex)
                    throw new Error("A node cannot have a transition to itself");
                // export transition target, condition and params
                this.result += "--n" + nodeIndex + "x" + j + " " + targetIndex + " ";
                this.result += "--c" + nodeIndex + "x" + j + " " + transition.category.id + " ";
                this.exportEdgeParams(transition, nodeIndex, j);
            }
        }
    }
    exportEdgeParams(edge, startNodeIndex, edgeIndex) {
        const params = edge.getParams();
        for (const p of Object.keys(params)) {
            this.result += "--" + p + startNodeIndex + "x" + edgeIndex + " " + params[p] + " ";
        }
    }
    findNbStates() {
        let nstates = 0;
        for (const e of this.elements) {
            if (e.isNode()) {
                nstates++;
            }
        }
        if (nstates === 0)
            throw "Invalid configuration : no node found";
        return nstates;
    }
    getNodeIndex(node) {
        let counter = 0;
        for (const n of this.elements) {
            if (n === node)
                return counter;
            if (n.isNode())
                counter++;
        }
        throw new Error("Node not in list");
    }
}