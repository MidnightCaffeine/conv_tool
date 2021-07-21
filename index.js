var oFileIn;

$(() => {
  document.getElementById("secret_key").addEventListener("keyup", function () {
    var secret_key_Input = document.getElementById("secret_key").value;
    if (secret_key_Input != "" && secret_key_Input === "ute1234") {
      document.getElementById("my_file_input").removeAttribute("disabled");
    } else {
      document.getElementById("my_file_input").setAttribute("disabled", null);
    }
  });

  oFileIn = document.getElementById("my_file_input");
  if (oFileIn.addEventListener) {
    oFileIn.addEventListener("change", filePicked, false);
  }
});

const filePicked = (oEvent) => {
  var sCSV = "";
  // Get The File From The Input
  var oFile = oEvent.target.files[0];
  var sFilename = oFile.name;
  // Create A File Reader HTML5
  var reader = new FileReader();
  // Ready The Event For When A File Gets Selected
  reader.onload = (e) => {
    var data = e.target.result;
    var cfb = XLS.CFB.read(data, { type: "binary" });
    var wb = XLS.parse_xlscfb(cfb);
    // Loop Over Each Sheet
    wb.SheetNames.forEach(function (sheetName) {
      // Obtain The Current Row As CSV
      sCSV = XLS.utils.make_csv(wb.Sheets[sheetName]);
      var oJS = XLS.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
      var table = document.createElement("table");
      var rows = sCSV.split("\n");
      //Below code will properly display the csv data in UI
      for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].split(",");
        if (cells.length > 1) {
          var row = table.insertRow(-1);
          for (var j = 0; j < cells.length; j++) {
            var cell = row.insertCell(-1);
            cell.innerHTML = cells[j];
          }
        }
      }
      var dvCSV = document.getElementById("my_file_output");
      dvCSV.innerHTML = "";
      dvCSV.appendChild(table);
    });
    //below code to write updated csv in text format
    const saveUpdatedData = (csvData) => {
      const finalData = csvData.split(",").join("#~#");
      var blob = new Blob([finalData], {
        type: "text/plain;charset=utf-8",
      });
      const fileName = `${sFilename.split(".")[0]}.txt`;
      //setTimeout(saveAs(blob, fileName), 8000);
      saveAs(blob, fileName);
    };
    saveUpdatedData(sCSV);
  };

  // Tell JS To Start Reading The File.. You could delay this if desired
  reader.readAsBinaryString(oFile);
};
