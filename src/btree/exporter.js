
function BtreeExporter(outputHTML) {
  this.outputHTML = outputHTML;
  this.outputHTML.text("");
}

BtreeExporter.prototype.setText = function(text) {
  this.outputHTML.attr("value", text);
}

BtreeExporter.prototype.export = function(graphEditor) {

  var elements = graphEditor.getElements();
  var root = undefined;

  // If elements empty, set empty string
  if(elements.length === 0) {
    this.setText("");
    return;
  }

  // Try to find root node
  for(var i = 0; i < elements.length; ++i) {
    var current = elements[i];

    // root candidate
    if(current.isNode() && current.getIncomingEdges().length === 0) {
      // two or more roots, error
      if(root !== undefined) {
        this.setText("Invalid configuration : multiple root nodes detected");
        return;
      }
      // else
      root = current;
    }
  }
  // if no root found
  if(root === undefined) {
    this.setText("Invalid configuration : no root node found");
    return;
  }

  // build tree
  this.setText("Root is " + root.getName());
}

