
function switchToBTree(graphEditor) {

  $("#title").text("AutoMoDe Behavior Trees Editor");
  $("#switchlink").text("switch to finite states machines");
  $("#cmdline").attr("value", "");

  graphEditor.clearElements();

  var exporter = new BTreeExporter($("#cmdline"));
  graphEditor.setExporter(exporter);

  var importer = new BTreeImporter($("#cmdline"));
  graphEditor.setImporter(importer);

  loadElementModels("btree/nodemodels.json", "btree/edgemodels.json", graphEditor);
  loadElementParams("btree/nodeparams.json", "btree/edgemodels.json", graphEditor);

  graphEditor.clearTools();
	graphEditor.addTool(new GraphEditorSelectTool());
	graphEditor.addTool(new GraphEditorNewNodeTool());
	graphEditor.addTool(new GraphEditorNewEdgeTool());
	graphEditor.addTool(new GraphEditorDraggingTool());
	graphEditor.addTool(new GraphEditorDeleteTool());
  graphEditor.addTool(new BTreeBeautifyTool());

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

  var importer = undefined;
  graphEditor.setImporter(importer);

  loadElementModels("fsm/nodemodels.json", "fsm/edgemodels.json", graphEditor);
  loadElementParams("fsm/nodeparams.json", "fsm/edgemodels.json", graphEditor);

  graphEditor.clearTools();
	graphEditor.addTool(new GraphEditorSelectTool());
	graphEditor.addTool(new GraphEditorNewNodeTool());
	graphEditor.addTool(new GraphEditorNewEdgeTool());
	graphEditor.addTool(new GraphEditorDraggingTool());
	graphEditor.addTool(new GraphEditorDeleteTool());

  $("#switchlink").click(function() {
    switchToBTree(graphEditor);
  });
}


function loadElementModels(nodes_url, edges_url, graphEditor) {

  graphEditor.setNodeModels([]);
  graphEditor.setEdgeModels([]);

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


function loadElementParams(nodes_url, edges_url, graphEditor) {

  graphEditor.setNodeParams([]);
  graphEditor.setEdgeParams([]);

  $.ajax({
    dataType: "json",
    url: nodes_url,
    mimeType: "application/json",
    success: function(result){
      graphEditor.setNodeParams(result);
    }
  });

  $.ajax({
    dataType: "json",
    url: edges_url,
    mimeType: "application/json",
    success: function(result){
      graphEditor.setEdgeParams(result);
    }
  });
}

$(document).keydown(function(event) {
  cmdline_keydown(event);
});

$(document).ready(function(){

	grapheditor = new GraphEditor(
		$("#graph-container"), $("#tools-container"),
		$("#param-container"));

	switchToBTree(grapheditor);
});

