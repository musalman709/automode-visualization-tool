import { GraphEditorExporter } from "../grapheditor";

export function findBTreeRoot(graphEditor) {

    var elements = graphEditor.getElements();
    var root = undefined;

    for(var i = 0; i < elements.length; ++i) {
        var current = elements[i];

        // root candidate
        if(current.isNode() && current.getIncomingEdges().length === 0) {
        // two or more roots, error
            if(root !== undefined) {
                throw "Invalid configuration : multiple root nodes detected";
            }
            // else
            root = current;
        }
    }
    // if no root found
    if(root === undefined) {
        throw "Invalid configuration : no root node found";
    }

    return root;
}

export class BTreeExporter extends GraphEditorExporter{
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
            var root = undefined;
            // If elements empty, set empty string
            if (elements.length === 0) {
                this.setText("");
                return;
            }
            // Try to find root node
            root = findBTreeRoot(graphEditor);
            // build string
            this.setText(this.expRootNode(root));
        }
        catch (err) {
            this.setText(err);
        }
    }
    expRootNode(rootNode) {
        var str = "--bt-config ";
        // add root type
        var type = rootNode.getModel().id;
        if (type < 0)
            throw "Invalid configuration : root node type is not selected";
        str += "--nroot " + type + " ";
        str += this.expNodeContent(rootNode, "root");
        return str;
    }
    expNode(node, nodeID) {
        var type = node.getModel().id;
        if (type < 0)
            throw "Invalid configuration : nodes types are not selected";
        var str = "--n" + nodeID + " " + type + " ";
        str += this.expNodeContent(node, nodeID);
        return str;
    }
    expNodeContent(node, nodeID) {
        if (node.getOutgoingEdges().length > 0) {
            return this.expNodeChildren(node, nodeID);
        }
        else {
            return this.expNodeParams(node, nodeID);
        }
    }
    expNodeChildren(node, nodeID) {
        var edges = node.getOutgoingEdges();
        var childrenNumber = edges.length;
        var str = "--nchild" + nodeID + " " + childrenNumber + " ";
        // sort child by x position
        edges.sort(function (e1, e2) {
            return e1.getDestNode().getPosition().x > e2.getDestNode().getPosition().x;
        });
        // fix nodeID if root
        if (nodeID == "root")
            nodeID = "";
        // print childs
        for (var i = 0; i < childrenNumber; ++i) {
            str += this.expNode(edges[i].getDestNode(), nodeID + i);
        }
        return str;
    }
    expNodeParams(node, nodeID) {
        var pdict = node.getParamDict();
        var str = "";
        for (var key in pdict) {
            if (pdict.hasOwnProperty(key)) {
                str += "--" + key + nodeID + " " + pdict[key] + " ";
            }
        }
        return str;
    }
}







