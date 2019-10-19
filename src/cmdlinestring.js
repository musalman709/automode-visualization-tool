/**
 * Event functions for import/export string
 */

export function copytoclipboard() {
    document.querySelector("#cmdline").select();
    document.execCommand("copy");
}

export function exporttofile() {
    const cmdline = document.querySelector("#cmdline").value;

    if(cmdline != "") {
        var encodedUri = encodeURI("data:text," + cmdline);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "cmdline-string.txt");
        document.body.appendChild(link); // Required for FF

        link.click();
    }
}

export function importfromcmdline(grapheditor) {
    grapheditor.callImporter();
}

export function triggeropenfile() {
    document.querySelector("#openfileinput").click();
}

export function importfromfile(grapheditor) {
    var input = document.getElementById("openfileinput");
    var reader = new FileReader();
    reader.readAsText(input.files[0]);
    reader.onloadend = function(){
        var cmdline = reader.result.split("\n")[0];
        document.querySelector("#cmdline").value = cmdline;
        grapheditor.callImporter();
    };
}

export async function execinsimulator() {
    const cmdline = document.querySElector("#cmdline").value;
    const execUrl = "/exec";
    const response = await fetch(execUrl, {
        method: "POST",
        body: JSON.stringify(cmdline),
        headers: {
            "Content-Type": "application/json"
        }
    });
    if (! response.ok) 
        throw new Error("Network error");
}

export function cmdline_keydown(event) {
    if(event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
        if(event.key == "s") {
            event.preventDefault();
            exporttofile();
        }
        if(event.key == "c") {
            event.preventDefault();
            copytoclipboard();
        }
        if(event.key == "o") {
            event.preventDefault();
            triggeropenfile();
        }
        if(event.key == "e") {
            event.preventDefault();
            execinsimulator();
        }
    }
}

