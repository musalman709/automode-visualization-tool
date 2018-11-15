
function BTreeExporter(outputHTML) {
  this.outputHTML = outputHTML;
  this.outputHTML.text("");
}

BTreeExporter.prototype.setText = function(text) {
  this.outputHTML.attr("value", text);
}

BTreeExporter.prototype.export = function(graphEditor) {

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
  this.setText(this.expRootNode(root));
}

BTreeExporter.prototype.expRootNode = function(rootNode) {

  var str = "--bt-config ";

  // add root type
  str += "--nroot <type> ";

  str += this.expNodeContent(rootNode, "root");

  return str;
}

BTreeExporter.prototype.expNode = function(node, nodeID) {

  var str = "-n" + nodeID + " <type> ";

  str += this.expNodeContent(node, nodeID);

  return str;
}

BTreeExporter.prototype.expNodeContent = function(node, nodeID) {

  var edges = node.getOutgoingEdges();
  var childrenNumber = edges.length;
  var str = "--nchild" + nodeID + " " + childrenNumber + " ";

  // sort child by x position
  edges.sort(function(e1, e2) {
    return e1.getDestNode().getPosition().x > e2.getDestNode().getPosition().x;
  });

  // fix nodeID if root
  if(nodeID == "root")
    nodeID = "";

  // print childs
  for(var i = 0; i < childrenNumber; ++i) {
    str += this.expNode(edges[i].getDestNode(), nodeID + i);
  }

  return str;
}

