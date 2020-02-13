import {h, Fragment} from "preact";
import {useState, useEffect} from "preact/hooks";
import { middle, getConnectPoint, getDirection, points_sum } from "../graph_utils";

export default ({graphEditor}) => {
    const [elements, setElements] = useState({nodes: [], edges: [], tools: [], selectedTool: {}});
    const setSelectedTool = tool => graphEditor.setCurrentTool(tool);

    useEffect(() => {
        graphEditor.subscribe(setElements);
        return () => {
            graphEditor.unSubscribe(setElements);
        };
    }, [graphEditor]);

    return (
        <>
            <article class="graph-container">
                <GraphContainer elements={elements} tool={elements.selectedTool} />
            </article>
            <Toolbar tools={elements.tools}
                selectedTool={elements.selectedTool}
                setSelectedTool={setSelectedTool} />
            <aside class="right-pane">
                <ParamPane element={elements.selected} graphEditor={graphEditor} />
            </aside>
        </>
    );
};

const ParamPane = ({element, graphEditor}) => {
    if (!element) return null;
    //model select
    const models = element.isNode()
        ? graphEditor.getNodeModels()
        : graphEditor.getEdgeModels();
    // parameter elements
    const model = element.getModel();
    const type = element.getType();
    const category = element.getCategory();
    // event handlers
    const setElementModel = (modelId) => graphEditor.setSelectionModel(modelId);
    const setElementCategory = (categoryId) => graphEditor.setSelectionCategory(categoryId);
    const setElementParam = (paramId, value) => graphEditor.setSelectionParam(paramId, value);

    return (
        <>
            <Select options={models} selectedOption={model} onOptionChange={setElementModel} />
            {category && <>
                {type.categoriesname}
                <Select options={type.categories} selectedOption={category} onOptionChange={setElementCategory} />
                {category.param.map(p => (
                    <label>
                        {p.name}
                        <ParamInput param={p} value={element.getParamValue(p.id)} 
                            onParamChange={setElementParam} />
                    </label>
                ))}
            </>}
        </>
    );
};

const Select = ({options, selectedOption, onOptionChange}) => {
    const handleChange = e => onOptionChange(e.target.value);

    return (
        <select class="d-block" onChange={handleChange}>
            {options.map(o => (
                <option value={o.id} selected={o === selectedOption}>
                    {o.name}
                </option>
            ))}
        </select>
    );
};

const ParamInput = ({param, value, onParamChange}) => {
    const handleChange = e => onParamChange(param.id, e.target.value);

    return (
        <div class="d-flex">
            <input class="paraminput d-block" type="number" name={param.name} onChange={handleChange}
                min={param.min} max={param.max} step={param.step} value={value} />
            <span class="textrange">[{param.min};{param.max}]</span>
        </div>
    );
};

const Toolbar = ({tools, selectedTool, setSelectedTool}) => (
    <div class="left-pane">
        <div id="tools-container">
            {tools.map(tool => 
                <button className={tool === selectedTool ? "tool selected" : "tool"}
                    onClick={() => setSelectedTool(tool)} >
                    {tool.getName()}
                </button>
            )}
        </div>
    </div>
);

const pointerEventPosition = e => ({x: e.pageX, y: e.pageY});

const GraphContainer = ({elements, tool}) => {
    const handleMouseDown = e => tool.onMouseDown(pointerEventPosition(e));
    const handleMouseDownOnElement = (event, element) => 
        tool.onMouseDown(pointerEventPosition(event), element);
    const handleMouseUp = e => tool.onMouseUp(pointerEventPosition(e));
    const handleMouseLeave = () => tool.onMouseLeave();
    const handleMouseMove = e => tool.onMouseMove(pointerEventPosition(e));
    
    return (
        <svg id="graph"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove} >
            <defs>
                <marker id="arrowhead" refX="10" refY="5" markerWidth="10" markerHeight="10" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 Z"></path>
                </marker>
            </defs>
            {elements.nodes.map(e => 
                <Node node={e}
                    isSelected={e === elements.selected}
                    handleClick={handleMouseDownOnElement} />
            )}
            {elements.edges.map(e => 
                <Edge edge={e}
                    isSelected={e === elements.selected}
                    handleClick={handleMouseDownOnElement} />
            )}
        </svg>
    );
};

const Node = ({node, isSelected, handleClick}) => {
    const handleShapeClick = (e) => {e.stopPropagation(); handleClick(e, node);};
    return (
        <Shape isSelected={isSelected}
            displayTag={node.model.display_tag}
            displayOptions={node.model.display_opts}
            position={node.position}
            label={node.category ? node.category.display_name : node.model.display_text}
            handleClick={handleShapeClick} />
    );
};

const Edge = ({edge, isSelected, handleClick}) => {
    const handleShapeClick = (e) => {e.stopPropagation(); handleClick(e, edge);};
    const srcPoint = getSrcPoint(edge.srcElement, edge.destElement);
    const destPoint = getDestPoint(edge.srcElement, edge.destElement);
    return (
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
                <Shape isSelected={isSelected}
                    displayTag={edge.model.node_display_tag}
                    displayOptions={edge.model.node_display_opts}
                    position={middle(edge.srcElement.position, edge.destElement.position)}
                    label={edge.category ? edge.category.display_name : edge.model.display_text}
                    handleClick={handleShapeClick} />
            }
        </>
    );
};

const Shape = ({displayTag, displayOptions, position, label, isSelected, handleClick}) => 
    <g transform={`translate(${position.x},${position.y})`} onMouseDown={handleClick}>
        {h(displayTag, {...displayOptions, class: `nodeFrame ${isSelected ? "selected" : ""}`}, null)}
        <text class="no-select" text-anchor="middle" dominant-baseline="middle" x="0" y="0">
            {label}
        </text>
    </g>;

const getSrcPoint = (srcElement, destElement) => {
    const direction = getDirection(srcElement.position, destElement.position);
    const connectPoint = getConnectPoint(srcElement.model.outgoing_connect_type, 
        srcElement.model.rx, srcElement.model.ry, direction);
    return points_sum(srcElement.position, connectPoint);
};

const getDestPoint = (srcElement, destElement) => {
    const direction = getDirection(destElement.position, srcElement.position);
    const connectPoint = getConnectPoint(destElement.model.incoming_connect_type, 
        destElement.model.rx, destElement.model.ry, direction);
    return points_sum(destElement.position, connectPoint);
};