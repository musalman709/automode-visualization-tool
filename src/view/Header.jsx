import {h, Fragment, createRef} from "preact";
import * as CmdlineUtils from "../cmdlineUtils";

const names = { fsm: "finite states machines", btree: "behavior trees" };
const titles = { fsm: "AutoMoDe Finite States Machines Editor", btree: "AutoMoDe Behavior Trees Editor" };

export const Header = ({graphEditor, cmdline, svgRef}) => {
    const mode = graphEditor.getMode();
    const toggleMode = e => {
        e.preventDefault();
        graphEditor.setMode(mode === "fsm" ? "btree" : "fsm");
    };
    return (
        <header>
            <div id="title-container">
                <h1 id="title">{titles[mode]}</h1>
                <a id="switchlink" href={mode} onClick={toggleMode}>
                    switch to {names[mode === "fsm" ? "btree" : "fsm"]}
                </a>
            </div>
            <Cmdline graphEditor={graphEditor} cmdline={cmdline} svgRef={svgRef} />
        </header>
    );
};

const Cmdline = ({graphEditor, cmdline, svgRef}) => {
    const cmdlineInput = createRef();
    const openFileInput = createRef();

    const openFile = async e => {
        const cmdline = await CmdlineUtils.importfromfile(e.target.files[0]);
        graphEditor.callImporter(cmdline);
    };
    const triggerOpenDialog = () => openFileInput.current.click();
    const importCmdline = () => graphEditor.callImporter(cmdline);
    const copyCmdline = () => {
        cmdlineInput.current.select();
        document.execCommand("copy");
    };
    const saveCmdline = () => CmdlineUtils.exporttofile(cmdline, "text/plain", "cmdline.txt");
    const exportSvg = () => {
        const bbox = svgRef.current.getBBox();
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${bbox.x-10} ${bbox.y-10} ${bbox.width+20} ${bbox.height+20}">` 
            + svgRef.current.innerHTML + "</svg>";
        CmdlineUtils.exporttofile(svg, "image/svg+xml", "export.svg");
    };
    const executeCmdline = () => CmdlineUtils.execinsimulator(cmdline);

    return (
        <div class="cmdline-container">
            <input ref={openFileInput} type="file" onChange={openFile} style="display: none;" />
            <button class="left" onClick={triggerOpenDialog}>
                <span class="underline">O</span>pen
            </button>
            <input ref={cmdlineInput} type="text" value={cmdline} onChange={importCmdline}
                onInput={e => graphEditor.setCmdline(e.target.value)}
                placeholder="Command line string" />
            <button class="right" onClick={copyCmdline}>
                <span class="underline">C</span>opy
            </button>
            <button class="right" onClick={saveCmdline}>
                <span class="underline">S</span>ave
            </button>
            <button class="right" onClick={exportSvg}>
                <span class="underline">E</span>xport
            </button>
            <button class="right" onClick={executeCmdline}>
                E<span class="underline">x</span>ec
            </button>
        </div>
    );
};
