export default class ParamInput extends HTMLElement {
    static get observedAttributes() {
        return ["name", "min", "max", "step", "value"];
    }
    
    constructor() {
        super();
        this._onChange = this._onChange.bind(this);
        const shadow = this.attachShadow({mode: "open"});
        this.titleP = document.createElement("p");
        this.titleP.className = "paramname";
        this.rangeSpan = document.createElement("span");
        this.rangeSpan.className = "textrange";
        this.paramInput = document.createElement("input");
        if (!this.paramInput.classList.contains("paraminput"))
            this.paramInput.classList.add("paraminput");
        this.paramInput.setAttribute("type", "number");
        this.paramInput.addEventListener("change", this._onChange);
        shadow.appendChild(this.titleP);
        shadow.appendChild(this.rangeSpan);
        shadow.appendChild(this.paramInput);
    }

    get value() {
        return this.getAttribute("value");
    }

    set value(newValue) {
        this.setAttribute("value", newValue);
    }

    _onChange() {
        this.value = this.paramInput.value;
        this.dispatchEvent(new Event("change"));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.paramInput.setAttribute(name, newValue);
            this.rangeSpan.textContent = `[${this.getAttribute("min")};${this.getAttribute("max")}]`;
            this.titleP.textContent = this.getAttribute("name");
        }
    }
}