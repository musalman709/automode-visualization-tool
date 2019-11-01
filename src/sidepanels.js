"use strict";

import { defaultEdgeModel, defaultEdgeParam, defaultNodeModel, defaultNodeParam } from "./elementmodels_default";

/**
 * Create a select option for a model
 */
function createModelOption(model, param, graphEditor, element) {
    const opt = document.createElement("option");
    opt.value = model.id;
    opt.textContent = model.name;
    opt.addEventListener("click", () => {
        element.setModel(model);
        element.setParam(param);
        graphEditor.updateParamPane();
        graphEditor.callExporter();
    });
    if(model === element.getModel()) {
        opt.setAttribute("selected", true);
    }
    return opt;
}

/**
 * Create a select list for nodes/edges models
 */
export function createModelsSelectMenu(graphEditor, element) {

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
    const selectTag = document.createElement("select");
    selectTag.classList.add("paramselect");

    // add the option for default model
    selectTag.appendChild(createModelOption(defaultModel, defaultParam, graphEditor,
        element));

    // add one option per available model
    modelsArray.forEach(function(model) {
        var param = undefined;
        if(element.isNode()) {
            param = graphEditor.getNodeParamById(model.id);
        } else {
            param = graphEditor.getEdgeParamById(model.id);
        }
        selectTag.appendChild(createModelOption(model, param, graphEditor, element));
    });

    return selectTag;
}

/**
 * Create a select list for nodes/edge category
 */
export function createCategorySelectMenu(params, element, catvalue, graphEditor) {
    const typeSelect = document.createElement("select");
    typeSelect.classList.add("paramselect");

    params.categories.forEach((c) => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = c.name;
        if(c.id == catvalue) {
            opt.setAttribute("selected", true);
        }
        opt.addEventListener("click", () => {
            element.setParamValue(params.categoryid, c.id);
            graphEditor.updateParamPane();
            graphEditor.callExporter();
        });
        typeSelect.appendChild(opt);
    });

    return typeSelect;
}

/**
 * Create an input for a node/edge parameter
 */
export function createParameterInput(param, element, graphEditor) {
    const paramInput = document.createElement("input");
    paramInput.classList.add("paraminput");
    paramInput.setAttribute("type", "number");
    paramInput.setAttribute("name", param.id);
    paramInput.setAttribute("min", param.min);
    paramInput.setAttribute("max", param.max);
    paramInput.setAttribute("step", param.step);
    paramInput.setAttribute("value", param.min);
    paramInput.value = element.getParamDict()[param.id];
    paramInput.addEventListener("change", () => {
        element.setParamValue(param.id, paramInput.value);
        graphEditor.callExporter();
    });
    return paramInput;
}

/**
 * Create the pane for node/edge category with each corresponding parameter
 */
export function createParamPane(params, element, container, graphEditor) {
    if(params.categories.length > 0) {
        const p = document.createElement("p");
        p.className = "asidetitle";
        p.appendChild(document.createTextNode(params.categoriesname));
        container.append(p);

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



