/**
 * GraphEditor main prototypes
 */

/**
 * Prototype of node and edges
 */
function GraphEditorElement() {
	this.grapheditor = undefined;
}
GraphEditorElement.prototype.getName = function() {
  return "<unknown element>";
}
GraphEditorElement.prototype.isNode = function() {}
GraphEditorElement.prototype.getSVGElement = function() {}
GraphEditorElement.prototype.setModel = function(model) {}
GraphEditorElement.prototype.getModel = function() {}
GraphEditorElement.prototype.setParam = function(param) {}
GraphEditorElement.prototype.getParam = function() {}
GraphEditorElement.prototype.setParamValue = function(param, value) {}
GraphEditorElement.prototype.getParamDict = function() {}
GraphEditorElement.prototype.move = function(newPos) {}
GraphEditorElement.prototype.getPosition = function() {}
GraphEditorElement.prototype.update = function() {}
GraphEditorElement.prototype.onSelect = function() {}
GraphEditorElement.prototype.onDeselect = function() {}
GraphEditorElement.prototype.onRemoval = function() {}

/**
 * Prototype of editor tools
 */
function GraphEditorTool() {
	this.grapheditor = undefined;
}
GraphEditorTool.prototype.onToolSelect = function() {}
GraphEditorTool.prototype.onToolDeselect = function() {}
GraphEditorTool.prototype.onMouseDown = function(pos, element) {}
GraphEditorTool.prototype.onMouseUp = function(pos) {}
GraphEditorTool.prototype.onMouseLeave = function() {}
GraphEditorTool.prototype.onMouseMove = function(pos) {}

/**
 * Prototype of graph to string exporters
 */
function GraphEditorExporter() {}
GraphEditorExporter.prototype.export = function() {}

/**
 * Prototype of string to graph importer
 */
function GraphEditorImporter() {}
GraphEditorImporter.prototype.import = function() {}


/**
 * Object that manages tools and graph elements,
 * create the svg area and receive input from the user 
 */
function GraphEditor(graphcontainer, toolscontainer, paramcontainer) {
  // html elements
	this.graphcontainer = graphcontainer;
	this.toolscontainer = toolscontainer;
	this.paramcontainer = paramcontainer;

	// import / export
	this.exporter = undefined;
	this.importer = undefined;

	// svg html element
	this.svg = undefined;

	// models lists
	this.nodemodels = [];
	this.nodeparams = [];
	this.edgemodels = [];
	this.edgeparams = [];

	// graph elements
	this.elements = [];

	// tools
	this.tools = [];
	this.defaultTool = undefined;
	this.currentTool = undefined;
	this.selectedElement = undefined;
	
	this.createGraph();
	
	var that = this;
	
	// events
	this.svg.on("mousedown", function(e) { that.onMouseDown(e); });
	this.svg.on("mouseup", function(e) { that.onMouseUp(e);	});
	this.svg.on("mouseleave", function(e) {	that.onMouseLeave(e); });
	this.svg.on("mousemove", function(e) { that.onMouseMove(e);	});
}

GraphEditor.prototype.createGraph = function() {
  // Initialisation function
	this.graphcontainer.empty();
	this.toolscontainer.empty();
	this.paramcontainer.empty();
	
	this.svg = createSVGElement("svg", {id:"graph"});
	this.svg.on("selectstart", function(e) { e.preventDefault(); });
	this.graphcontainer.append(this.svg);
	
	this.defs = createSVGElement("defs", {});
	var arrowMarker = createSVGElement("marker", 
		{id:"arrowhead", refX:10, refY:5, markerWidth:10, markerHeight:10,
		orient:"auto-start-reverse"});
	var arrowMarkerShape = createSVGElement("path", 
		{d:"M 0 0 L 10 5 L 0 10 Z"});
	arrowMarker.append(arrowMarkerShape);
	this.defs.append(arrowMarker);
	this.svg.append(this.defs);
}

GraphEditor.prototype.width = function() {
  return this.svg.width();
}

GraphEditor.prototype.height = function() {
  return this.svg.height();
}

GraphEditor.prototype.setNodeModels = function(data) {
  this.nodemodels = data;
}

GraphEditor.prototype.setNodeParams = function(data) {
  this.nodeparams = data;
}

GraphEditor.prototype.setEdgeModels = function(data) {
  this.edgemodels = data;
}

GraphEditor.prototype.setEdgeParams = function(data) {
  this.edgeparams = data;
}

GraphEditor.prototype.getNodeModels = function() {
  return this.nodemodels;
}

GraphEditor.prototype.getNodeModelById = function(id) {
  var model = undefined;
  this.nodemodels.forEach(function(m) {
    if(m.id == id) {
      model = m;
    }
  });

  return model;
}

GraphEditor.prototype.getNodeParams = function() {
  return this.nodeparams;
}

GraphEditor.prototype.getNodeParamById = function(id) {
  var param = undefined;
  this.nodeparams.forEach(function(p) {
    if(p.nodeid == id) {
      param = p;
    }
  });

  return param;
}

GraphEditor.prototype.getEdgeModels = function() {
  return this.edgemodels;
}

GraphEditor.prototype.getEdgeParamById = function(id) {
  var param = undefined;
  this.edgeparams.forEach(function(p) {
    if(p.edgeid == id) {
      param = p;
    }
  });

  if(param === undefined) {
    return defaultEdgeParam();
  }
  return param;
}

GraphEditor.prototype.getEdgeParams = function() {
  return this.edgeparams;
}

GraphEditor.prototype.addElement = function(element) {
	if(element instanceof GraphEditorElement) {
		this.elements.push(element);
		element.graphEditor = this;
		
		var that = this;
		element.getSVGElement().on("mousedown", function(e) {
			that.onMouseDown(e, element);
			e.stopPropagation();
		});
		this.svg.append(element.getSVGElement());	
		this.callExporter();
	}
}

GraphEditor.prototype.removeElement = function(element) {
	if(this.elements.remove(element)) {
		element.onRemoval();
		element.getSVGElement().remove();
		if(this.selectedElement === element) {
			this.setSelectedElement(undefined);
		}
		this.callExporter();
	}
}

GraphEditor.prototype.getElements = function() {
  return this.elements;
}

GraphEditor.prototype.clearElements = function() {
  // Not the most efficient but we are sur that all elements
  // are deleted properly
  while(this.elements.length > 0) {
    this.removeElement(this.elements[this.elements.length-1]);
  }
}

GraphEditor.prototype.setSelectedElement = function(element) {
  // unselect previous element
	if(this.selectedElement !== undefined) {
		this.selectedElement.onDeselect();
	}
	
	this.selectedElement = element;
	this.paramcontainer.empty();

  // select new element
	if(this.selectedElement !== undefined) {
		this.selectedElement.onSelect();
    this.updateParamPane();
	}
}

GraphEditor.prototype.getSelectedElement = function() {
	return this.selectedElement;
}

GraphEditor.prototype.updateParamPane = function() {
  this.paramcontainer.empty();
  if(this.selectedElement !== undefined) {
    // model selector
    this.paramcontainer.append($("<p class=\"asidetitle\">Type</p>"));
	  this.paramcontainer.append(createModelsSelectMenu(this,
	    this.selectedElement));
	  // parameter elements
	  createParamPane(this.selectedElement.getParam(), this.selectedElement,
	    this.paramcontainer, this);
  }
}

GraphEditor.prototype.addTool = function(tool, isdefault = false) {
	if(tool instanceof GraphEditorTool) {
		this.tools.push(tool);
		tool.graphEditor = this;

		var graphEditor = this;
		var element = jQuery("<p/>", {class:"tool",
		id:"tool_" + tool.getToolId(), text:tool.getName()});
		element.on("click", function(e) {
			graphEditor.setCurrentTool(tool);
		});
		this.toolscontainer.append(element);

		if(isdefault) {
		  this.setDefaultTool(tool);
		}
	}
}

GraphEditor.prototype.setDefaultTool = function(tool) {
  if(this.tools.contains(tool)) {
    this.defaultTool = tool;

    if(this.currentTool === undefined) {
      this.setCurrentTool(tool);
    }
  }
  else {
    this.defaultTool = undefined;
  }
}

GraphEditor.prototype.setCurrentTool = function(tool) {
	if(this.currentTool !== undefined) {
		$("#tool_" + this.currentTool.getToolId())
		.attr("class", "tool");
		this.currentTool.onToolDeselect();
	}
	
	this.currentTool = tool;
	
	if(this.currentTool == undefined) {
	  this.currentTool = this.defaultTool;
	}

	if(this.currentTool !== undefined) {
		$("#tool_" + this.currentTool.getToolId())
		.attr("class", "tool selected");
		this.currentTool.onToolSelect();
	}
}

GraphEditor.prototype.clearTools = function() {
  this.setCurrentTool(undefined);
  this.setDefaultTool(undefined);
  this.tools = [];
	this.toolscontainer.empty();
}

GraphEditor.prototype.SVGCoordFromHTML = function(x, y) {
	var svgPt = this.svg[0].createSVGPoint();
	svgPt.x = x;
	svgPt.y = y;
	svgPt = svgPt.matrixTransform(this.svg[0].getScreenCTM().inverse());
	return svgPt;
}

GraphEditor.prototype.onMouseDown = function(e, element) {
	if(this.currentTool !== undefined) {
		var pos = this.SVGCoordFromHTML(e.pageX, e.pageY);
		this.currentTool.onMouseDown(pos, element);
	}
}
GraphEditor.prototype.onMouseUp = function(e) {
	if(this.currentTool !== undefined) {
		var pos = this.SVGCoordFromHTML(e.pageX, e.pageY);
		this.currentTool.onMouseUp(pos);
	}
}
GraphEditor.prototype.onMouseLeave = function(e) {
	if(this.currentTool !== undefined) {
		this.currentTool.onMouseLeave();
	}
}
GraphEditor.prototype.onMouseMove = function(e) {
	if(this.currentTool !== undefined) {
		var pos = this.SVGCoordFromHTML(e.pageX, e.pageY);
		this.currentTool.onMouseMove(pos);
	}
}

GraphEditor.prototype.addSVGElement = function(element) {
	this.svg.append(element);
}

GraphEditor.prototype.setExporter = function(exporter) {
  if(exporter instanceof GraphEditorExporter) {
    this.exporter = exporter;
  } else {
    this.exporter = undefined;
  }
}

GraphEditor.prototype.callExporter = function() {
  if(this.exporter !== undefined) {
    this.exporter.export(this);
  }
}

GraphEditor.prototype.setImporter = function(importer) {
  if(importer instanceof GraphEditorImporter) {
    this.importer = importer;
  } else {
    this.importer = undefined;
  }
}

GraphEditor.prototype.callImporter = function() {
  if(this.importer !== undefined) {
    this.importer.import(this);
  }
}

