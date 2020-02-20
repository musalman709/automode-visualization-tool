import {h, Fragment} from "preact";

export const ToolPane = ({ tools, selectedTool, setSelectedTool }) => (
    <div class="left-pane">
        <div id="tools-container">
            {tools.map(tool => <button className={tool === selectedTool ? "tool selected" : "tool"} onClick={() => setSelectedTool(tool)}>
                {tool.getName()}
            </button>)}
        </div>
    </div>
);
