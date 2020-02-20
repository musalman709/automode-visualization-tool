import {h, Fragment} from "preact";

export const ParamPane = ({ element, graphEditor }) => {
    if (!element)
        return <aside class="right-pane" />;
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
        <aside class="right-pane">
            <Select options={models} selectedOption={model} onOptionChange={setElementModel} />
            {category && <>
                {type.categoriesname}
                <Select options={type.categories} selectedOption={category} onOptionChange={setElementCategory} />
                {category.param.map(p => (<label>
                    {p.name}
                    <ParamInput param={p} value={element.getParamValue(p.id)} onParamChange={setElementParam} />
                </label>))}
            </>}
        </aside>
    );
};

const Select = ({ options, selectedOption, onOptionChange }) => {
    const handleChange = e => onOptionChange(e.target.value);
    return (<select class="paraminput" onChange={handleChange}>
        {options.map(o => (<option value={o.id} selected={o === selectedOption}>
            {o.name}
        </option>))}
    </select>);
};

const ParamInput = ({ param, value, onParamChange }) => {
    const handleChange = e => onParamChange(param.id, e.target.value);
    return (<div class="d-flex">
        <input class="paraminput d-block" type="number" name={param.name} onChange={handleChange} min={param.min} max={param.max} step={param.step} value={value} />
        <span class="textrange">[{param.min};{param.max}]</span>
    </div>);
};
