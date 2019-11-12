import {h, Fragment} from "preact"

export default ({elements, handleClick}) =>
    elements.map(e => e.isNode() 
        ? <Node node={e} handleClick={(event) => {event.stopPropagation(); handleClick(event, e);}} /> 
        : <Edge edge={e} />);

const Node = ({node, handleClick}) => 
        <g transform={`translate(${node.pos.x},${node.pos.y})`} onMouseDown={handleClick}>
            {h(node.model.display_tag, node.model.display_opts, null)}
            <text text-anchor="middle" dominant-baseline="middle" x="0" y="0">
                {node.category ? node.category.display_name : node.model.display_text}
            </text>
        </g>

const Edge = ({edge}) =>
    <line className="line" marker-end="url(#arrowhead)"
        x1={edge.srcElement.outgoingPos.x}
        y1={edge.srcElement.outgoingPos.y}
        x2={edge.destElement.incomingPos.x}
        y2={edge.destElement.incomingPos.y}>
    </line>