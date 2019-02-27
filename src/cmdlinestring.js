function copytoclipboard() {
  $("#cmdline").select();
  document.execCommand("copy");
}

function exporttofile() {
  // https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side

  var cmdline = $("#cmdline").val()

  if(cmdline != "") {
    var encodedUri = encodeURI("data:text," + cmdline);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "cmdline-string.txt");
    document.body.appendChild(link); // Required for FF

    link.click();
  }
}

function importfromcmdline() {
  var cmdline = $("#cmdline").val();

  grapheditor.callImporter();
}

function triggeropenfile() {
  $("#openfileinput").click();
}

function importfromfile() {
  var input = document.getElementById("openfileinput");
  var reader = new FileReader();
  reader.readAsText(input.files[0]);
  reader.onloadend = function(event){
    $("#cmdline").val(reader.result);
    grapheditor.callImporter();
  }
}

