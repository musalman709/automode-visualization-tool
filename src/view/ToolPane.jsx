import {h, Fragment} from "preact";
import { GraphEditorDeleteTool } from "../tools/shared/deleteTool";
import { GraphEditorDraggingTool } from "../tools/shared/dragTool";
import { GraphEditorNewEdgeTool } from "../tools/shared/newEdgeTool";
import { GraphEditorNewNodeTool } from "../tools/shared/newNodeTool";
import { GraphEditorRootSelectorTool } from "../tools/fsm/rootSelector";
import { BTreeBeautifyTool } from "../tools/btree/beautifier";

const FSMTools = [new GraphEditorDraggingTool(), new GraphEditorNewNodeTool(),
    new GraphEditorNewEdgeTool(), new GraphEditorDeleteTool(),
    new GraphEditorRootSelectorTool()];

const BtreeTools = [new GraphEditorDraggingTool(), new GraphEditorNewNodeTool(),
    new GraphEditorNewEdgeTool(), new GraphEditorDeleteTool(),
    new BTreeBeautifyTool()];

/**
 * Return the tools for FSM or Btree mode 
 */
export function getToolsForMode(mode) {
    switch (mode) {
    case "fsm":
        return FSMTools;
    case "btree":
        return BtreeTools;
    default:
        throw new Error("Invalid mode");
    }
}






export const ToolPane = ({ tools, selectedTool, setSelectedTool }) => (
    <div class="left-pane">
        <div id="tools-container">
            {tools.map(tool => <button className={tool === selectedTool ? "tool selected" : "tool"} onClick={() => setSelectedTool(tool)}>
                {tool.getName()}
            </button>)}
        </div>
    </div>
);
