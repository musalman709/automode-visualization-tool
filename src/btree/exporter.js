import { findBTreeRoot } from "./btreeutils";

export default class BTreeExporter {
    export(graph) {
        const nodes = graph.getNodes();
        // If elements empty, set empty string
        if (nodes.length === 0) {
            return "";
        }
        // Try to find root node
        const root = findBTreeRoot(nodes);
        // build string
        return this.expRootNode(root);
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
            const type = node.getType();
            const category = node.getCategory();
            if (category) {
                return `--${type.categoryid}${nodeID} ${category.id} ` + this.expNodeParams(node, nodeID);
            } else {
                return this.expNodeParams(node, nodeID);
            }
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
        var pdict = node.getParams();
        var str = "";
        for (const [key, value] of pdict) {
            str += "--" + key + nodeID + " " + value + " ";
        }
        return str;
    }
}







