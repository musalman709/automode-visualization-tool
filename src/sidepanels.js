"use strict";

/**
 * Create a select list for nodes/edges models
 */
export function createModelsSelectMenu(graphEditor, element) {
    var modelsArray = undefined;

    // get the models
    if(element.isNode()) {
        modelsArray = graphEditor.getNodeModels();
    } else {
        modelsArray = graphEditor.getEdgeModels();
    }

    const ts = document.querySelector("#typeSelector");
    ts.setOptions(modelsArray, element.getModel());
}

/**
 * Create a select list for nodes/edge category
 */
function createCategorySelectMenu(params, element, catvalue, graphEditor) {
    const typeSelect = document.createElement("option-selector");
    typeSelect.setOptions(params.categories, params.categories.filter(cat => cat.id === catvalue)[0]);
    typeSelect.addEventListener("change", e => {
        element.setParamValue(params.categoryid, e.target.value);
        graphEditor.updateParamPane();
        graphEditor.callExporter();
    });
    return typeSelect;
}

/**
 * Create an input for a node/edge parameter
 */
function createParameterInput(param, element, graphEditor) {
    const paramInput = document.createElement("param-input");
    paramInput.setAttribute("name", param.id);
    paramInput.setAttribute("min", param.min);
    paramInput.setAttribute("max", param.max);
    paramInput.setAttribute("step", param.step);
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

        const catvalue = element.getParamDict()[params.categoryid];
        container.append(createCategorySelectMenu(params, element, catvalue,
            graphEditor));

        params.categories.forEach(function(c) {
            if(c.id == catvalue) {
                c.param.forEach(function(p) {
                    container.append(createParameterInput(p, element, graphEditor));
                });
            }
        });
    }
}



