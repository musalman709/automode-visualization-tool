//import htmlTemplate from "./templateUtils";
import {html, render, svg} from "lit-html";

const template = elements => html`
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
    </style>
    <svg>
        <defs>
            <marker id="arrowhead" refX="10" refY="5" markerWidth="10" markerHeight="10" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 Z"></path>
            </marker>
            <!--<g id="nodeTemplate">
                <circle class="nodeFrame" r="30" cx="0" cy="0"></circle>
                <text text-anchor="middle" dominant-baseline="middle" x="0" y="0"></text>
            </g>-->
        </defs>
        ${elements.map(e => nodeTemplate(e))}
    </svg>
`;

const nodeTemplate = element => svg`
    <g transform="translate(${element.pos.x},${element.pos.y})">
        ${circle(30)}
        <text text-anchor="middle" dominant-baseline="middle" x="0" y="0">
            ${element.category ? element.category.display_name : "[node]"}
        </text>
    </g>
`;

const circle = radius => svg`
    <circle class="nodeFrame" r=${radius} cx="0" cy="0"></circle>
`;

export default class GraphCanvas extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        //this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.setElements([]);
    }
    setElements(elements) {
        /*const graph = this.shadowRoot.querySelector("#graph");
        const nodeTemplate = this.shadowRoot.querySelector("#nodeTemplate");
        //Adjust the number of children to match elements size
        for (let i = 0; i < elements.length - graph.children.length; i++)
            graph.appendChild(nodeTemplate.cloneNode(true));
        for (let i = 0; i < graph.children.length - elements.length; i++)
            graph.removeChild(graph.firstChild);
            
        for (let i = 0; i < elements.length; i++) {
            const child = graph.children[i];
            const pos = elements[i].getPosition();
            const transform = `translate(${pos.x},${pos.y})`;
            child.setAttribute("transform", transform);
            child.children[1].textContent = elements[i].category.display_name;
        }*/
        render(template(elements), this.shadowRoot);
    }
}