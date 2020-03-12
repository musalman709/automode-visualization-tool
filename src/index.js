import { GraphEditorDeleteTool } from "./tools/shared/deleteTool";
import { GraphEditorDraggingTool } from "./tools/shared/dragTool";
import { GraphEditorNewEdgeTool } from "./tools/shared/newEdgeTool";
import { GraphEditorNewNodeTool } from "./tools/shared/newNodeTool";
import GraphEditor from "./grapheditor";
import { GraphEditorRootSelectorTool } from "./tools/fsm/rootSelector";
import { render, h } from "preact";
import App from "./view/App.jsx";

/**
 * Key pressed events
 */
/*document.addEventListener("keydown", (event) => {
    if(event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
        if(event.key == "s") {
            event.preventDefault();
            cmdlinestring.exporttofile();
        }
        if(event.key == "c") {
            event.preventDefault();
            cmdlinestring.copytoclipboard();
        }
        if(event.key == "o") {
            event.preventDefault();
            cmdlinestring.triggeropenfile();
        }
        if(event.key == "e") {
            event.preventDefault();
            cmdlinestring.execinsimulator();
        }
    }
});*/


/**
 * Initialisation when loading ends
 */
let grapheditor = new GraphEditor();

const FSMTools = [new GraphEditorDraggingTool(grapheditor), new GraphEditorNewNodeTool(grapheditor),
    new GraphEditorNewEdgeTool(grapheditor), new GraphEditorDeleteTool(grapheditor),
    new GraphEditorRootSelectorTool(grapheditor)];

const BtreeTools = [new GraphEditorDraggingTool(grapheditor), new GraphEditorNewNodeTool(grapheditor),
    new GraphEditorNewEdgeTool(grapheditor), new GraphEditorDeleteTool(grapheditor)];
// render the editor using preact
render(h(App, {graphEditor: grapheditor, tools: {fsm: FSMTools, btree: BtreeTools}}, null), document.querySelector("#app"));
