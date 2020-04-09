import {h, Fragment} from "preact";
import {useState, useEffect, useRef} from "preact/hooks";
import { ToolPane } from "./ToolPane.jsx";
import { Header } from "./Header.jsx";
import { ParamPane } from "./ParamPane.jsx";
import { GraphContainer } from "./GraphContainer.jsx";
import { ErrorBar } from "./ErrorBar.jsx";

export default ({graphEditor, tools}) => {
    // UI state
    const [elements, setElements] = useState(graphEditor.getElements());
    const [mode, setMode] = useState(graphEditor.getMode());
    const [selectedTool, setSelectedTool] = useState(tools[mode][0]);
    const [cmdline, setCmdline] = useState(graphEditor.getCmdline());
    const [errorMessage, setErrorMessage] = useState(graphEditor.getErrorMessage());
    // reference to the graph svg
    const svgRef = useRef(null);

    const changeMode = (newMode) => {
        setMode(newMode);
        // reset the UI
        setElements(graphEditor.getElements());
        setSelectedTool(tools[newMode][0]);
    };
    const changeCmdline = (newCmdline, newErrorMessage) => {
        setCmdline(newCmdline);
        setErrorMessage(newErrorMessage);
    };
    const changeTool = (newTool) => {
        if (selectedTool !== newTool) {
            setSelectedTool(newTool);
            graphEditor.setSelectedElement();
        }
    };
    // listen to changes to the model
    useEffect(() => {
        const listener = {
            elementsChange: () => setElements(graphEditor.getElements()),
            modeChange: () => changeMode(graphEditor.getMode()),
            cmdlineChange: () => changeCmdline(graphEditor.getCmdline(), graphEditor.getErrorMessage())
        };
        graphEditor.addListener(listener);
        return () => {
            graphEditor.removeListener(listener);
        };
    }, [graphEditor]);

    return (
        <>
            <Header graphEditor={graphEditor} cmdline={cmdline}
                svgRef={svgRef} />
            <ErrorBar message={errorMessage} />
            <article class="graph-container">
                <GraphContainer elements={elements} tool={selectedTool}
                    svgRef={svgRef} />
            </article>

            <ToolPane graphEditor={graphEditor}
                tools={tools[mode]}
                selectedTool={selectedTool}
                setSelectedTool={changeTool} />
            <ParamPane element={elements.selected} graphEditor={graphEditor} />
        </>
    );  
};