import {h, Fragment} from "preact";
import { middle, getConnectPoint, getDirection, points_sum } from "../graph_utils";

export default ({elements, selectedElement, handleClick}) =>
    <svg id="graph">
        <defs>
            <marker id="arrowhead" refX="10" refY="5" markerWidth="10" markerHeight="10" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 Z"></path>
            </marker>
        </defs>
        {elements.map(e => 
            <Element element={e}
                isSelected={e === selectedElement}
                handleClick={handleClick} />
        )}
    </svg>;
const Element = ({element, isSelected, handleClick}) => {
    const onClick = (event) => {event.stopPropagation(); handleClick(event, element);};

    return element.isNode() 
        ? <Node isSelected={isSelected}
            displayTag={element.model.display_tag}
            displayOptions={element.model.display_opts}
            position={element.pos}
            label={element.category ? element.category.display_name : element.model.display_text}
            handleClick={onClick} /> 
        : <Edge isSelected={isSelected}
            edge={element}
            handleClick={onClick}
            srcPoint={getSrcPoint(element.srcElement, element.destElement)}
            destPoint={getDestPoint(element.srcElement, element.destElement)} />;
};
const Node = ({displayTag, displayOptions, position, label, isSelected, handleClick}) => 
    <g transform={`translate(${position.x},${position.y})`} onMouseDown={handleClick}>
        {h(displayTag, {...displayOptions, class: `nodeFrame ${isSelected ? "selected" : ""}`}, null)}
        <text text-anchor="middle" dominant-baseline="middle" x="0" y="0">
            {label}
        </text>
    </g>;

const Edge = ({edge, srcPoint, destPoint, isSelected, handleClick}) =>
    <>
        <line className={`line ${isSelected ? "selected" : ""}`}
            onMouseDown={handleClick}
            marker-end="url(#arrowhead)"
            x1={srcPoint.x}
            y1={srcPoint.y}
            x2={destPoint.x}
            y2={destPoint.y}>
        </line>
        {edge.model.node_display_tag &&
            <Node isSelected={isSelected}
                displayTag={edge.model.node_display_tag}
                displayOptions={edge.model.node_display_opts}
                position={middle(edge.srcElement.outgoingPos, edge.destElement.incomingPos)}
                label={edge.category ? edge.category.display_name : edge.model.display_text}
                handleClick={handleClick} />
        }
    </>;

const getSrcPoint = (srcElement, destElement) => {
    const direction = getDirection(srcElement.pos, destElement.pos);
    const connectPoint = getConnectPoint(srcElement.model.outgoing_connect_type, 
        srcElement.model.rx, srcElement.model.ry, direction);
    return points_sum(srcElement.pos, connectPoint);
};

const getDestPoint = (srcElement, destElement) => {
    const direction = getDirection(destElement.pos, srcElement.pos);
    const connectPoint = getConnectPoint(destElement.model.incoming_connect_type, 
        destElement.model.rx, destElement.model.ry, direction);
    return points_sum(destElement.pos, connectPoint);
};