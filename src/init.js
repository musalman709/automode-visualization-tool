
function switchToBTree(graphEditor) {

  $("#title").text("AutoMoDe Behavior Trees Editor");
  $("#switchlink").text("switch to finite states machines");
  $("#cmdline").attr("value", "");

  graphEditor.clearElements();

  var exporter = new BTreeExporter($("#cmdline"));
  graphEditor.setExporter(exporter);

  loadElementModels("btree/nodemodels.json", "btree/edgemodels.json", graphEditor);

  $("#switchlink").click(function() {
    switchToFSM(graphEditor);
  });
}


function switchToFSM(graphEditor) {

  $("#title").text("AutoMoDe Finite States Machines Editor");
  $("#switchlink").text("switch to behavior trees");
  $("#cmdline").attr("value", "");

  graphEditor.clearElements();

  var exporter = undefined;
  graphEditor.setExporter(exporter);

  loadElementModels("fsm/nodemodels.json", "fsm/edgemodels.jsm", graphEditor);

  $("#switchlink").click(function() {
    switchToBTree(graphEditor);
  });
}


function loadElementModels(nodes_url, edges_url, graphEditor) {

  graphEditor.setNodeModels(undefined);
  graphEditor.setEdgeModels(undefined);

  $.ajax({
    dataType: "json",
    url: nodes_url,
    mimeType: "application/json",
    success: function(result){
      graphEditor.setNodeModels(result);
    }
  });

  $.ajax({
    dataType: "json",
    url: edges_url,
    mimeType: "application/json",
    success: function(result){
      graphEditor.setEdgeModels(result);
    }
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
