import { h, Fragment } from "preact";
import { useRef } from "preact/hooks";
import { getConnectPoint, getDirection, points_sum } from "../graph_utils";

export const GraphContainer = ({ elements, tool }) => {
    const svg = useRef(null);
    const pointerEventPosition = e => {
        const ctm = svg.current.getScreenCTM();
        const x = (e.clientX - ctm.e) / ctm.a;
        const y = (e.clientY - ctm.f) / ctm.d;
        return { x, y };
    };
    const handleMouseDown = e => tool.onMouseDown(pointerEventPosition(e), undefined, e.ctrlKey);
    const handleMouseDownOnElement = (event, element, isCtrlKeyPressed) => tool.onMouseDown(pointerEventPosition(event), element, isCtrlKeyPressed);
    const handleMouseUp = e => tool.onMouseUp(pointerEventPosition(e));
    const handleMouseLeave = () => tool.onMouseLeave();
    const handleMouseMove = e => tool.onMouseMove(pointerEventPosition(e));
    return (
        <svg ref={svg} id="graph" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove}>
            <defs>
                <marker id="arrowhead" refX="10" refY="5" markerWidth="10" markerHeight="10" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 Z"></path>
                </marker>
            </defs>
            {elements.nodes.map(e => <Node node={e} isSelected={e === elements.selected} handleClick={handleMouseDownOnElement} />)}
            {elements.edges.map(e => <Edge edge={e} isSelected={e === elements.selected} handleClick={handleMouseDownOnElement} />)}
        </svg>
    );
};

const Node = ({ node, isSelected, handleClick }) => {
    const handleShapeClick = (e) => { e.stopPropagation(); handleClick(e, node, e.ctrlKey); };
    return (<Shape isSelected={isSelected} displayTag={node.model.display_tag} displayOptions={node.model.display_opts} position={node.position} label={node.category ? node.category.display_name : node.model.display_text} handleClick={handleShapeClick} />);
};

const Edge = ({ edge, isSelected, handleClick }) => {
    const handleShapeClick = (e) => { e.stopPropagation(); handleClick(e, edge); };

    // check whether we need to display a shape on the edge
    if (edge.model.node_display_tag) {
        const srcPoint = getSrcPoint(edge.srcElement, edge);
        const destPoint = getDestPoint(edge, edge.destElement);
        return (<>
            <line className={`line ${isSelected ? "selected" : ""}`} onMouseDown={handleClick}
                x1={srcPoint.x} y1={srcPoint.y} 
                x2={edge.position.x} y2={edge.position.y} />
            <line className={`line ${isSelected ? "selected" : ""}`} onMouseDown={handleClick}
                marker-end="url(#arrowhead)" x1={edge.position.x} y1={edge.position.y} 
                x2={destPoint.x} y2={destPoint.y} />
            <Shape isSelected={isSelected} displayTag={edge.model.node_display_tag}
                displayOptions={edge.model.node_display_opts} position={edge.position}
                label={edge.category ? edge.category.display_name : edge.model.display_text}
                handleClick={handleShapeClick} />
        </>);
    } else {
        const srcPoint = getSrcPoint(edge.srcElement, edge.destElement);
        const destPoint = getDestPoint(edge.srcElement, edge.destElement);
        return (<>
            <line className={`line ${isSelected ? "selected" : ""}`} onMouseDown={handleClick}
                marker-end="url(#arrowhead)" x1={srcPoint.x} y1={srcPoint.y} 
                x2={destPoint.x} y2={destPoint.y} />
        </>);
    }
};

const Shape = ({ displayTag, displayOptions, position, label, isSelected, handleClick }) => <g transform={`translate(${position.x},${position.y})`} onMouseDown={handleClick}>
    {h(displayTag, { ...displayOptions, class: `nodeFrame ${isSelected ? "selected" : ""}` }, null)}
    <text class="no-select" text-anchor="middle" dominant-baseline="middle" x="0" y="0">
        {label}
    </text>
</g>;

const getSrcPoint = (srcElement, destElement) => {
    const direction = getDirection(srcElement.position, destElement.position);
    const connectPoint = getConnectPoint(srcElement.model.outgoing_connect_type, srcElement.model.rx, srcElement.model.ry, direction);
    return points_sum(srcElement.position, connectPoint);
};
const getDestPoint = (srcElement, destElement) => {
    const direction = getDirection(destElement.position, srcElement.position);
    const connectPoint = getConnectPoint(destElement.model.incoming_connect_type, destElement.model.rx, destElement.model.ry, direction);
    return points_sum(destElement.position, connectPoint);
};
