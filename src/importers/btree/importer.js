import { GraphEdge } from "../../model/graphEdge";
import { GraphNode } from "../../model/graphNode";
import Graph from "../../model/graph";
import { getNodeTypes } from "../../model/types";

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
    end() {
        return this.i >= this.args.length;
    }
}




export class BTreeImporter {
    isStartArg(arg) {
        return arg == "--bt-config";
    }
    isArg(arg) {
        return arg.substring(0, 2) == "--";
    }
    isValue(arg) {
        return !isNaN(arg);
    }
    import(inputString) {
        this.graph = new Graph();
        // build parameters dict
        var iterator = new CmdLineIterator(inputString);
        var dict = {};
        while (!iterator.end()) {
            var key = iterator.next();
            if (this.isStartArg(key) || key == "")
                continue;
            var value = iterator.next();
            if (this.isArg(key) && this.isValue(value))
                dict[key] = value;
            else
                throw "Argument " + key + " is invalid";
        }
        if (inputString !== "") {
            this.importNode(dict, "root");
        }
        return this.graph;
    }
    importNode(dict, nodeID) {
        var argname = "--n" + nodeID;
        if (!dict.hasOwnProperty(argname))
            throw "Cannot find argument " + argname;
        var nodeType = dict[argname];
        var type = getNodeTypes("btree")[Number(nodeType)];
        var node = new GraphNode({ x: 30, y: 30 }, type);
        this.graph.addNode(node);
        this.importParams(dict, nodeID, node);
        if (type.max_outgoing_edges > 0) {
            this.importChildren(dict, nodeID, node);
        }
        return node;
    }
    importChildren(dict, nodeID, parentNode) {
        var argname = "--nchild" + nodeID;
        if (!dict.hasOwnProperty(argname))
            return;
        var childrenNb = dict[argname];
        if (nodeID == "root") {
            nodeID = "";
        }
        for (var i = 0; i < childrenNb; ++i) {
            var node = this.importNode(dict, nodeID + i.toString());
            var edge = new GraphEdge(parentNode, node, getEdgeTypes("btree")[0]);
            if (edge.isValid()) {
                this.graph.addEdge(edge);
            }
        }
    }
    importParams(dict, nodeID, node) {
        const type = node.getType();
        if (type.categories.length > 0) {
            // get category id
            var catargname = "--" + type.categoryid + nodeID;
            if (!dict.hasOwnProperty(catargname))
                return;
            var categoryid = dict[catargname];
            // get category
            const category = type.categories.find(c => c.id === Number(categoryid));
            if (category === undefined)
                return;
            // set node category
            node.setCategory(category);
            // get params
            category.params.forEach(function (p) {
                var paramargname = "--" + p.id + nodeID;
                if (dict.hasOwnProperty(paramargname)) {
                    var value = dict[paramargname];
                    node.setParam(p.id, value);
                }
            });
        }
    }
}