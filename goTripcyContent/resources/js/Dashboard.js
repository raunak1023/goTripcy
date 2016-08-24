function searchOnFocus(ele) {
	document.getElementById("PaceholderId").className = "searchPaceholder-active";
}

function searchOnBlur(ele) {
	var searchTxt = document.getElementById("locationSearchInpt").value;
	if(searchTxt != undefined) {
		searchTxt = searchTxt.trim();
		if(searchTxt == ''){
			document.getElementById("PaceholderId").className = "searchPaceholder";
		}
	}
}

function showDiv(divId, imgId){
	document.getElementById(divId).style.display = 'inline';
	document.getElementById(imgId).src = 'resources/images/icon/Blue_Arrow_Collapsed.png';
}

function hideDiv(divId, imgId){
	document.getElementById(divId).style.display = 'none';
	document.getElementById(imgId).src = 'resources/images/icon/Blue_Arrow_Expanded.png';
}

function to_json(workbook) {
    var result = {};
    workbook.SheetNames.forEach(function(sheetName) {
        var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        if(roa.length > 0){
            result[sheetName] = roa;
        }
    });
    console.log(result);
    return result;
}

function onLoad() {
	var url = "resources/excel/sample.xlsx";
	var oReq = new XMLHttpRequest();
	oReq.open("GET", url, true);
	oReq.responseType = "arraybuffer";

	oReq.onload = function(e) {
	  var arraybuffer = oReq.response;

	  /* convert data to binary string */
	  var data = new Uint8Array(arraybuffer);
	  var arr = new Array();
	  for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
	  var bstr = arr.join("");

	  /* Call XLSX */
	  var workbook = XLSX.read(bstr, {type:"binary"});

	  /* DO SOMETHING WITH workbook HERE */
	  to_json(workbook);
	}

	oReq.send();
}