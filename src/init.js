
function switchToBTree(graphEditor) {

  $("#title").text("Behavior Trees Editor");
  $("#switchlink").text("switch to finite states machines");
  $("#cmdline").attr("value", "");

  graphEditor.clearElements();

  var exporter = new BTreeExporter($("#cmdline"));
  graphEditor.setExporter(exporter);

  $("#switchlink").click(function() {
    switchToFSM(graphEditor);
  });
}


function switchToFSM(graphEditor) {

  $("#title").text("Finite States Machines Editor");
  $("#switchlink").text("switch to behavior trees");
  $("#cmdline").attr("value", "");

  graphEditor.clearElements();

  var exporter = undefined;
  graphEditor.setExporter(exporter);

  $("#switchlink").click(function() {
    switchToBTree(graphEditor);
  });
}


$(document).ready(function(){

	grapheditor = new GraphEditor(
		$("#graph-container"), $("#tools-container"),
		$("#param-container"));
	grapheditor.addTool(new GraphEditorSelectTool());
	grapheditor.addTool(new GraphEditorNewNodeTool());
	grapheditor.addTool(new GraphEditorNewEdgeTool());
	grapheditor.addTool(new GraphEditorDraggingTool());
	grapheditor.addTool(new GraphEditorDeleteTool());

	switchToBTree(grapheditor);
});
