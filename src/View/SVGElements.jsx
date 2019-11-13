import {h, Fragment} from "preact"
import { middle } from "../graph_utils";

export default ({elements, selectedElement, handleClick}) =>
    elements.map(e => 
        <Element element={e}
            isSelected={e === selectedElement}
            handleClick={handleClick} />
    );
const Element = ({element, isSelected, handleClick}) => {
    const onClick = (event) => {event.stopPropagation(); handleClick(event, element);}

    return element.isNode() 
    ? <Node isSelected={isSelected}
        displayTag={element.model.display_tag}
        displayOptions={element.model.display_opts}
        position={element.pos}
        label={element.category ? element.category.display_name : element.model.display_text}
        handleClick={onClick} /> 
    : <Edge isSelected={isSelected}
        edge={element}
        handleClick={onClick} />
}
const Node = ({displayTag, displayOptions, position, label, isSelected, handleClick}) => 
    <g transform={`translate(${position.x},${position.y})`} onMouseDown={handleClick}>
        {h(displayTag, {...displayOptions, class: `nodeFrame ${isSelected ? "selected" : ""}`}, null)}
        <text text-anchor="middle" dominant-baseline="middle" x="0" y="0">
            {label}
        </text>
    </g>

const Edge = ({edge, isSelected, handleClick}) =>
    <>
        <line className={`line ${isSelected ? "selected" : ""}`}
            onMouseDown={handleClick}
            marker-end="url(#arrowhead)"
            x1={edge.srcElement.outgoingPos.x}
            y1={edge.srcElement.outgoingPos.y}
            x2={edge.destElement.incomingPos.x}
            y2={edge.destElement.incomingPos.y}>
        </line>
        {edge.model.node_display_tag &&
            <Node isSelected={isSelected}
                displayTag={edge.model.node_display_tag}
                displayOptions={edge.model.node_display_opts}
                position={middle(edge.srcElement.outgoingPos, edge.destElement.incomingPos)}
                label={edge.category ? edge.category.display_name : edge.model.display_text}
                handleClick={handleClick} />
        }
    </>