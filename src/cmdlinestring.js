/**
 * Event functions for import/export string
 */

function copytoclipboard() {
  $("#cmdline").select();
  document.execCommand("copy");
}

function exporttofile() {
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
    var cmdline = reader.result.split("\n")[0];
    $("#cmdline").val(cmdline);
    grapheditor.callImporter();
  }
}

function execinsimulator() {
  var cmdline = $("#cmdline").val();
  var data = {cmdline:cmdline};

  $.ajax({
      url: 'exec',
      data: data,
      type: 'POST',
      success: function(response) {
          console.log(response);
      },
      error: function(error) {
          console.log(error);
      }
  });
}

function cmdline_keydown(event) {
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

