"use strict";

/**
 * Create a select option for a model
 */
function createModelOption(model, param, graphEditor, element) {
  var opt_tag = $('<option></option>');

  opt_tag.val(model.id);
  opt_tag.html(model.name);
  opt_tag.click(function(obj) {
    element.setModel(model);
    element.setParam(param);
    graphEditor.updateParamPane();
    graphEditor.callExporter();
  });

  if(model === element.getModel()) {
    opt_tag.attr("selected", "selected");
  }

  return opt_tag;
}

/**
 * Create a select list for nodes/edges models
 */
function createModelsSelectMenu(graphEditor, element) {

  var modelsArray = undefined;
  var defaultModel = undefined;
  var defaultParam = undefined;

  // get the models
  if(element.isNode()) {
    modelsArray = graphEditor.getNodeModels();
    defaultModel = defaultNodeModel();
    defaultParam = defaultNodeParam();
  } else {
    modelsArray = graphEditor.getEdgeModels();
    defaultModel = defaultEdgeModel();
    defaultParam = defaultEdgeParam();
  }

  // build the combo box
  var select_tag = $('<select></select>');
  select_tag.addClass("paramselect");

  // add the option for default model
  select_tag.append(createModelOption(defaultModel, defaultParam, graphEditor,
    element));

  // add one option per available model
  modelsArray.forEach(function(model) {
    var param = undefined;
    if(element.isNode()) {
      param = graphEditor.getNodeParamById(model.id);
    } else {
      param = graphEditor.getEdgeParamById(model.id);
    }
    select_tag.append(createModelOption(model, param, graphEditor, element));
  });

  return select_tag;
}

/**
 * Create a select list for nodes/edge category
 */
function createCategorySelectMenu(params, element, catvalue, graphEditor) {
  var catselect = $("<select></select>");
  catselect.addClass("paramselect");
  params.categories.forEach(function(c){
    var opt = $("<option></option>");
    opt.val(c.id);
    opt.text(c.name);
    if(c.id == catvalue) {
      opt.attr("selected", "selected");
    }
    opt.click(function(obj) {
      element.setParamValue(params.categoryid, c.id);
      graphEditor.updateParamPane();
      graphEditor.callExporter();
    });
    catselect.append(opt);
  });

  return catselect;
}

/**
 * Create an input for a node/edge parameter
 */
function createParameterInput(param, element, graphEditor) {
  var paraminput = $("<input type=number></input>");
  paraminput.addClass("paraminput");
  paraminput.attr("name", param.id);
  paraminput.attr("min", param.min);
  paraminput.attr("max", param.max);
  paraminput.attr("step", param.step);
  paraminput.attr("value", param.min);
  paraminput.val(element.getParamDict()[param.id]);
  paraminput.on('change', function() {
    element.setParamValue(param.id, paraminput.val());
    graphEditor.callExporter();
  });
  return paraminput;
}

/**
 * Create the pane for node/edge category with each corresponding parameter
 */
function createParamPane(params, element, container, graphEditor) {
  if(params.categories.length > 0) {

    container.append($("<p class=\"asidetitle\">" + params.categoriesname + "</p>"));

    var catvalue = element.getParamDict()[params.categoryid];
    container.append(createCategorySelectMenu(params, element, catvalue,
      graphEditor));

    params.categories.forEach(function(c) {
      if(c.id == catvalue) {
        c.param.forEach(function(p) {
          container.append("<p class=\"paramname\">" + p.name +
            "<span class=\"textrange\">[" + p.min + "; " + p.max + "]</span>" +
            "</p>");
          container.append(createParameterInput(p, element, graphEditor));
        });
      }
    });
  }
}



