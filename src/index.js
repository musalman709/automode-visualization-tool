import { GraphEditorSelectTool, GraphEditorNewNodeTool, GraphEditorNewEdgeTool, GraphEditorDraggingTool, GraphEditorDeleteTool } from "./grapheditortools";
import { BTreeBeautifyTool } from "./btree/beautifier";
import BTreeExporter from "./btree/exporter";
import { BTreeImporter } from "./btree/importer";
import { FSMExporter } from "./fsm/exporter";
import { FSMImporter } from "./fsm/importer";
import GraphEditor from "./grapheditor";
import { cmdline_keydown, importfromfile, triggeropenfile, importfromcmdline, copytoclipboard, exporttofile, execinsimulator } from "./cmdlinestring";
import btreeNodeModels from "./btree/nodemodels.json";
import btreeEdgeModels from "./btree/edgemodels.json";
import btreeNodeParams from "./btree/nodeparams.json";
import btreeEdgeParams from "./btree/edgeparams.json";
import fsmNodeModels from "./fsm/nodemodels.json";
import fsmEdgeModels from "./fsm/edgemodels.json";
import fsmNodeParams from "./fsm/nodeparams.json";
import fsmEdgeParams from "./fsm/edgeparams.json";


/**
 * Initialisations functions
 */

/**
 * Initialise editor and tools for BTrees
 */
function switchToBTree(graphEditor) {
    document.querySelector("#title").textContent = "AutoMoDe Behavior Trees Editor";
    document.querySelector("#switchlink").textContent = "switch to finite states machines";
    document.querySelector("#cmdline").value = "";

    graphEditor.clearElements();
    graphEditor.setMode("btree");

    var exporter = new BTreeExporter();
    graphEditor.setExporter(exporter);

    var importer = new BTreeImporter($("#cmdline"));
    graphEditor.setImporter(importer);

    graphEditor.setNodeModels(btreeNodeModels);
    graphEditor.setEdgeModels(btreeEdgeModels);
    graphEditor.setNodeParams(btreeNodeParams);
    graphEditor.setEdgeParams(btreeEdgeParams);

    graphEditor.clearTools();
    graphEditor.addTool(new GraphEditorSelectTool(), true);
    graphEditor.addTool(new GraphEditorNewNodeTool());
    graphEditor.addTool(new GraphEditorNewEdgeTool());
    graphEditor.addTool(new GraphEditorDraggingTool());
    graphEditor.addTool(new GraphEditorDeleteTool());
    graphEditor.addTool(new BTreeBeautifyTool());
}

/**
 * Initialise tools and editor for FSM
 */
function switchToFSM(graphEditor) {
    document.querySelector("#title").textContent = "AutoMoDe Finite States Machines Editor";
    document.querySelector("#switchlink").textContent = "switch to behavior trees";
    document.querySelector("#cmdline").value = "";

    graphEditor.clearElements();
    graphEditor.setMode("fsm");

    var exporter = new FSMExporter();
    graphEditor.setExporter(exporter);

    var importer = new FSMImporter($("#cmdline"));
    graphEditor.setImporter(importer);

    graphEditor.setNodeModels(fsmNodeModels);
    graphEditor.setEdgeModels(fsmEdgeModels);
    graphEditor.setNodeParams(fsmNodeParams);
    graphEditor.setEdgeParams(fsmEdgeParams);

    graphEditor.clearTools();
    graphEditor.addTool(new GraphEditorSelectTool(), true);
    graphEditor.addTool(new GraphEditorNewNodeTool());
    graphEditor.addTool(new GraphEditorNewEdgeTool());
    graphEditor.addTool(new GraphEditorDraggingTool());
    graphEditor.addTool(new GraphEditorDeleteTool());
}

/**
 * Toggle between btree and FSM mode
 */
function toggleMode(graphEditor) {
    if (grapheditor.getMode() === "fsm") {
        switchToBTree(graphEditor);
    } else {
        switchToFSM(graphEditor);
    }
}

/**
 * Key pressed events
 */
document.addEventListener("keydown", cmdline_keydown);


/**
 * Initialisation when loading ends
 */
let grapheditor = new GraphEditor(
    $("#graph-container"), $("#tools-container"),
    $("#param-container"));
const openFileInput = document.querySelector("#openfileinput");
const openFileButton = document.querySelector("#openfilebutton");
const cmdline = document.querySelector("#cmdline");
const copyButton = document.querySelector("#copybutton");
const fileExportButton = document.querySelector("#fileexportbutton");
const executeButton = document.querySelector("#executebutton");
const switchLink = document.querySelector("#switchlink");

openFileInput.addEventListener("change", () => importfromfile(grapheditor));
openFileButton.addEventListener("click", triggeropenfile);
cmdline.addEventListener("change", () => importfromcmdline(grapheditor));
copyButton.addEventListener("click", copytoclipboard);
fileExportButton.addEventListener("click", exporttofile);
executeButton.addEventListener("click", execinsimulator);
switchLink.addEventListener("click", () => toggleMode(grapheditor));
	
switchToFSM(grapheditor);