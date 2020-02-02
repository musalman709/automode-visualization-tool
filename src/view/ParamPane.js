export default class ParamPane extends HTMLElement {
    constructor() {
        super();
        //bind event handlers
        this._onModelChange = this._onModelChange.bind(this);
        this._onCategoryChange = this._onCategoryChange.bind(this);
        this._onParamChange = this._onParamChange.bind(this);

        this._shadow = this.attachShadow({mode: "open"});
        this._modelSelect = document.createElement("option-selector");
        this._categoriesNameP = document.createElement("p");
        this._categorySelect = document.createElement("option-selector");
        this._paramsDiv = document.createElement("div");

        this._modelSelect.addEventListener("change", this._onModelChange);
        this._categorySelect.addEventListener("change", this._onCategoryChange);

        this._shadow.appendChild(this._modelSelect);
        this._shadow.appendChild(this._categoriesNameP);
        this._shadow.appendChild(this._categorySelect);
        this._shadow.appendChild(this._paramsDiv);
    }

    _onModelChange() {
        this.dispatchEvent(new CustomEvent("modelChange", {detail: {
            model: this._modelSelect.value
        }}));
    }

    _onCategoryChange() {
        this.dispatchEvent(new CustomEvent("categoryChange", {detail: {
            category: this._categorySelect.value
        }}));
    }

    _onParamChange(event) {
        const target = event.target;
        this.dispatchEvent(new CustomEvent("paramChange", {detail: {
            id: target.getAttribute("pid"),
            value: target.value
        }}));
    }

    setModels(models, selectedModel) {
        this._modelSelect.setOptions(models, selectedModel);
    }

    setCategories(categories, categoriesName, selectedCategory) {
        this._categoriesNameP.textContent = categoriesName;
        this._categorySelect.setOptions(categories, selectedCategory);
    }

    setParams(params, values) {
        this.clearParams();
        for (const param of params) {
            const paramInput = document.createElement("param-input");
            paramInput.setAttribute("pid", param.id);
            paramInput.setAttribute("name", param.name);
            paramInput.setAttribute("min", param.min);
            paramInput.setAttribute("max", param.max);
            paramInput.setAttribute("step", param.step);
            paramInput.value = values.get(param.id);
            paramInput.addEventListener("change", this._onParamChange);
            this._paramsDiv.appendChild(paramInput);
        }
    }

    clearParams() {
        let firstChild;
        while ((firstChild = this._paramsDiv.firstChild))
            this._paramsDiv.removeChild(firstChild);
    }

    clear() {
        this.setModels([]);
        this.setCategories([]);
        this.clearParams();
    }
}