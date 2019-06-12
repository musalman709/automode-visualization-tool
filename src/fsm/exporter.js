function FSMExporter(outputHTML) {
  this.outputHTML = outputHTML;
  this.outputHTML.text("");
}

FSMExporter.prototype = Object.create(GraphEditorExporter.prototype);

FSMExporter.prototype.setText = function(text) {
  this.outputHTML.val(text);
}

FSMExporter.prototype.export = function(graphEditor) {
  try {
    var elements = graphEditor.getElements();

    // If elements empty, set empty string
    if(elements.length === 0) {
      this.setText("");
      return;
    }

    // Get the number of states
    nbS = this.findNbStates(graphEditor);

    // build string 
    var str = this.expStates(nbS, graphEditor);
    str += this.expTransitions(graphEditor, elements);
    this.setText(str);

  } catch(err) {
    this.setText(err);
  }
}


FSMExporter.prototype.findNbStates = function(graphEditor){
    
    var elements = graphEditor.getElements();
    var nbS = 0;

    for( var i = 0;i<elements.length; i++){
        if(elements[i].isNode()){
            nbS++;
        }
    }
    if(nbS == 0){
        throw "Invalid configuration : no node found";
    }
    return nbS;
}

FSMExporter.prototype.expStates = function(nbS, graphEditor){//TODO

    var str = "--fsm-config ";
    
    str += "--nstates " + nbS +" ";

    var elements = graphEditor.getElements();
    var nodeCounter = 0;
    for (var i =0; i <elements.length; i++){
        if( elements[i].isNode()){
            str += this.expNodeParams(elements[i], nodeCounter);
            nodeCounter++;
        }
    }

    return str;
}

FSMExporter.prototype.expNodeParams = function(node, nodeCounter) {

  var pdict = node.getParamDict();
  var str = "";

  for(var key in pdict) {
    if(pdict.hasOwnProperty(key)) {
      str += "--" + key + nodeCounter + " " + pdict[key] + " ";
    }
  }

  return str;
}

FSMExporter.prototype.expTransitions = function(graphEditor, elements){
    var str = "";
    var nodeCounter = 0;
    for (var i = 0; i < elements.length; i++) {
        var node = elements[i];
        if(node.isNode()){
            if(node.getOutgoingEdges().length>0){
                str += "--n"+nodeCounter + " " + node.getOutgoingEdges().length+" ";
                for (var j = 0; j <node.getOutgoingEdges().length; j++) {
                    target = this.getIdFromElement(node.getOutgoingEdges()[j].getDestNode(), elements);
                    str += "--n"+i+"x"+j+" "+target+" ";
                    str += this.expEdgeParams(node.getOutgoingEdges()[j], i, j, target)
                }
                nodeCounter++;
            }
        }
    }
    return str;
}

FSMExporter.prototype.expEdgeParams = function(edge, startEdge, edgeNumber, destEdge) {

  var pdict = edge.getParamDict();
  var str = "";

  for(var key in pdict) {
    if(pdict.hasOwnProperty(key)) {
      str += "--" + key + startEdge + "x" + edgeNumber + " " + pdict[key] + " ";
    }
  }
  return str;
}

FSMExporter.prototype.getIdFromElement = function(element, elementList){
    for(let i = 0; i<elementList.length;i++){
        if(element == elementList[i]){
            return i;
        }
    }
    return -1;
}