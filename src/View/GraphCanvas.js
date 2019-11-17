import html from "./templateUtils";
import {h, render} from "preact";
import SVGElements from "./SVGElements.jsx";

const template = html`
    <style>
        svg {
            display: inline-block;
            width: 1200px;
            height: 675px;
            background-color: #FFFFFF;
            margin: 16px;
        }
        .nodeFrame {
	        fill: white;
	        stroke-width: 1px;
	        stroke: black;
        }
        .line {
            stroke: black;
        }
    </style>
    <svg>
        <defs>
            <marker id="arrowhead" refX="10" refY="5" markerWidth="10" markerHeight="10" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 Z"></path>
            </marker>
        </defs>
        <g id="graph"></g>
    </svg>
`;

export default class GraphCanvas extends HTMLElement {
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.shadowRoot.querySelector("svg").addEventListener("mousedown", (e) => this.handleClick(e));
        this.setElements([]);
    }
    handleClick(event, element) {
        event.stopPropagation();
        event.target.dispatchEvent(new CustomEvent("elementClick", {
            detail: {element, pageX: event.pageX, pageY: event.pageY},
            bubbles: true,
            composed: true
        }));
    }
    setElements(elements) {
        render(h(SVGElements, {elements, handleClick: this.handleClick}, null), this.shadowRoot.querySelector("#graph"));
    }
}