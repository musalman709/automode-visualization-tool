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
        var link = document.querySelector("#downloadLink");
        link.setAttribute("href", encodedUri);
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
    const cmdline = document.querySelector("#cmdline").value;
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