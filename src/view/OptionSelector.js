export default class OptionSelector extends HTMLElement {
    constructor() {
        super();
        this._onChange = this._onChange.bind(this);
        const shadow = this.attachShadow({mode: "open"});
        // model selector
        this.select = document.createElement("select");
        this.select.style.display = "none";
        this.select.addEventListener("change", this._onChange);
        shadow.appendChild(this.select);
    }

    _onChange() {
        this.value = this.select.value;
        this.dispatchEvent(new Event("change"));
    }

    setOptions(options, selectedOption) {
        this.removeSelectChildren();
        // add options to select tag
        for (const option of options) {
            const optionTag = document.createElement("option");
            optionTag.value = option.id;
            optionTag.textContent = option.name;
            if (option === selectedOption)
                optionTag.setAttribute("selected", true);
            this.select.appendChild(optionTag);
        }
        this.setVisibility();
    }

    clearOptions() {
        this.removeSelectChildren();
        this.setVisibility();
    }

    removeSelectChildren() {
        let firstChild;
        while ((firstChild = this.select.firstChild))
            this.select.removeChild(firstChild);
    }

    setVisibility() {
        if (this.select.firstChild)
            this.select.style.display = "block";
        else 
            this.select.style.display = "none";
    }
}