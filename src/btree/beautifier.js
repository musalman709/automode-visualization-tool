import { GraphEditorTool } from "../grapheditor";
import { findBTreeRoot } from "./exporter";

/**
 * Beautifier algorithm
 */

/**
 * Move nodes to make the tree looks better
 */
export function beautifyBTree(graphEditor, rootNode) {

    var area = {x:0, y:0, w:0, h:0, relh:0, relw:0};
    area.w = graphEditor.width();
    area.h = graphEditor.height();

    var rootInfo = getBTreeNodeInfo(rootNode);

    setBTreeNodePosition(rootNode, rootInfo, area);
}

/**
 * Recursively collect node informations
 */
function getBTreeNodeInfo(node) {

    var info = {depth:1, cumulativeChildrenNb:0, childrenInfo:[]};
    var edges = node.getOutgoingEdges();

    if(edges.length == 0) {
        info.cumulativeChildrenNb = 1;
    }

    edges.forEach(function(e) {
        var i = getBTreeNodeInfo(e.getDestNode());
        if(info.depth < i.depth + 1) {
            info.depth = i.depth + 1;
        }
        info.cumulativeChildrenNb += i.cumulativeChildrenNb;
        info.childrenInfo.push(i);
    });

    return info;
}

/**
 * Recursively update node positions
 */
function setBTreeNodePosition(node, info, area) {

    if(area.relh == 0)
        area.relh = area.h / info.depth;
    if(area.relw == 0)
        area.relw = area.w / info.cumulativeChildrenNb;

    node.move({x:(area.x + area.w/2), y:(area.y + area.relh/2)});

    var edges = node.getOutgoingEdges();
    var widthAccumulator = 0;

    for(var i = 0; i < edges.length; ++i) {
        var n = edges[i].getDestNode();
        var ci = info.childrenInfo[i];

        var relwidth = area.relw * ci.cumulativeChildrenNb;

        var a = {x:area.x + widthAccumulator,
            y:area.y + area.relh,
            w:relwidth,
            h:area.h - area.relh,
            relw:area.relw,
            relh:area.relh};

        setBTreeNodePosition(n, ci, a);

        widthAccumulator += relwidth;
    }
}


/**
 * Beautify tool
 */
export class BTreeBeautifyTool extends GraphEditorTool{
    getToolId() {
        return "btree_beautify";
    }
    getName() {
        return "Beautify";
    }
    onToolSelect() {
    // call beautifier algo
        try {
            this.graphEditor.setSelectedElement(undefined);
            var root = findBTreeRoot(this.graphEditor);
            beautifyBTree(this.graphEditor, root);
        }
        catch (err) {
            // pass
        }
        // Reselect default tool
        this.graphEditor.setCurrentTool(undefined);
    }
}


