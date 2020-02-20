/**
 * Util functions for import/export
 */


export function exporttofile(cmdline) {
    if(cmdline != "") {
        const encodedUri = encodeURI("data:text," + cmdline);
        const link = document.querySelector("#downloadLink");
        link.setAttribute("href", encodedUri);
        link.click();
    }
}

export async function importfromfile(file) {
    if (!file) return "";
    const result = await new Response(file).text();
    return result.split("\n")[0];
}

export async function execinsimulator(cmdline) {
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