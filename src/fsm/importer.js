
/**
 * Iterator over the string tree, extracting one argument at a time
 */
function CmdLineIterator(cmdlinestring) {
  this.args = cmdlinestring.split(" ");
  this.i = 0;
}

CmdLineIterator.prototype.next = function() {
  if(this.i >= this.args.length)
    return "";

  while(this.args[this.i] == "")
  {
    this.i += 1;
    if(this.i >= this.args.length)
      return "";
  }

  var elem = this.args[this.i];
  this.i += 1;
  return elem;
}

CmdLineIterator.prototype.end = function() {
  return this.i >= this.args.length;
}


function FSMImporter(inputHTML) {
  this.inputHTML = inputHTML;
}

FSMImporter.prototype = Object.create(GraphEditorImporter.prototype);

FSMImporter.prototype.isStartArg = function(arg) {
  return arg === "--fsm-config";
}

FSMImporter.prototype.isArg = function(arg) {
  return arg.substring(0,2) == "--";
}

FSMImporter.prototype.isValue = function(arg) {
  return ! isNaN(arg);
}

FSMImporter.prototype.isCorrectState = function(arg, i){
    return arg == ("--s"+i);
}

FSMImporter.prototype.import = function(graphEditor) {//this "compiles" the command line and generates the graph
    try {
        // build parameters dict
        console.log("starting to import")
        var cmdlinestring = this.inputHTML.val();
        var iterator = new CmdLineIterator(cmdlinestring);
        graphEditor.clearElements();

        var firstArg = iterator.next();
        if(! this.isStartArg(firstArg)){
            throw "first arg must be --fsm-config and not "+firstArg+".";
        }
        var secArg = iterator.next();
        if(secArg.localeCompare("--nstates")){
            throw "second arg must be --nstates and not "+secArg+".";
        }
        var nbStates = iterator.next();
        if (! this.isValue(nbStates)){
            throw "the number of states must be a integer you wrote "+nbStates;
        }
        nbStates=Math.round(nbStates); //making sure it is an integer, 2.5 states would not work well

        console.log("basic imports done")

        var state = undefined;
        var behav = undefined;
        for(var i = 0; i<nbStates;i++){//there must be exaclty nbStates of states definition
            state = iterator.next();
            if(! this.isCorrectState(state, i)){
                throw "the state definition is not correct, plase verify it, problem with " + state;
            }
            behav = iterator.next();
            this.importNode(graphEditor, behav, i, iterator)//will import the node and the parameters
        }

        console.log("states imported")

        while(! iterator.end()) { //import the edges
            var nextItem = iterator.next();  // should be of type --nAxB or of type --nS
            if(nextItem=="" || nextItem.length==4){ //--type --nS i is not useful as every edge is written afterwards
                iterator.next()
                continue;
            }
            var startNode = nextItem[3]; //needs the A from --nAxB
            startNode = graphEditor.getElements()[startNode] // this works because the first elements to be created are the nodes
            var transNumber = nextItem[5];
            var destNode = iterator.next();
            destNode = graphEditor.getElements()[destNode];
            this.importEdges(graphEditor, iterator, startNode, destNode);
        }

        console.log("String imported")

        // reset cmdline to proper one
        graphEditor.callExporter();
    } catch(err) {
        graphEditor.clearElements();
        // rewrite cmdline, so user can fix it
        this.inputHTML.val(cmdlinestring);
        alert(err);
    }
}

FSMImporter.prototype.importNode = function(graphEditor, behav, i, iterator) {
    var model = graphEditor.getNodeModelById("0");//there is only one model and one set of parameters for said model
    var param = graphEditor.getNodeParamById("0");

    var node = new GraphEditorNode("imp_node", {x:100+(i%2)*200, y:100+Math.floor(i/2)*200});//placement is defined here
    node.setModel(model);
    node.setParam(param);
    this.importNodeParams(behav, node, iterator);
    graphEditor.addElement(node);

return node;
}

FSMImporter.prototype.importNodeParams = function(behav, node, iterator) {
    var param = node.getParam();

    if(param.categories.length > 0)
    {
        // get category
        var category = undefined;
        param.categories.forEach(function(c) {
            if(c.id == behav) {
                category = c;
            }
        });

        if(category === undefined)
            throw "behaviour number not correct: "+behav;

        // set node category
        node.setParamValue(param.categoryid, behav);

        // get params
        category.param.forEach(function(p) {
            let next = iterator.next();
            currentParam = next.substring(2,next.length-1);
            if(p.id== currentParam){ //No verification if the parameter is valid, we assume the value is; could check with the min/max value
                var value = iterator.next();
                node.setParamValue(p.id, value);
            }else{
                throw "invalid parameter of node at this place written: "+currentParam;
            }
        });
    }
}

FSMImporter.prototype.importEdges = function(graphEditor, iterator, startNode, destNode) {
    var condition = iterator.next(); //should be --cAxB
    var transType = iterator.next();

    var edge = new GraphEditorEdge("imp_edge", startNode, destNode);
    edge.graphEditor = graphEditor;
    edge.setModel(graphEditor.getEdgeModelById("0")); //only one model for the edges
    edge.setParam(graphEditor.getEdgeParamById("0"));
    this.importEdgeParams(edge, iterator, transType);
    if(edge.isValid()) {
        graphEditor.addElement(edge);
    }
}

FSMImporter.prototype.importEdgeParams = function(edge, iterator, transType) {  //TODO
    var param = edge.getParam();

    if(param.categories.length > 0)
    {
        // get category
        var category = undefined;
        param.categories.forEach(function(c) {
            if(c.id == transType) {
                category = c;
            }
        });

        if(category === undefined)
            throw "behaviour number not correct: "+transType;

        // set edge category
        edge.setParamValue(param.categoryid, transType);

        // get params
        category.param.forEach(function(p) {
            currentParam = iterator.next()[2];
            if(p.id == currentParam) { //No verification if the parameter is valid, we assume it is; could check with the min/max value
                var value = iterator.next();
                edge.setParamValue(p.id, value);
            }else{
                throw "invalid parameter of edge at this place written: "+currentParam;
            }
        });
    }
}