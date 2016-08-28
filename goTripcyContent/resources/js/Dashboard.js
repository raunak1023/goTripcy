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
	document.getElementById(divId).style.display = 'block';
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
    loadDataToPage(result);
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
	  var workbook = XLSX.read(bstr, {type:"binary"});
	  to_json(workbook);
	}
	oReq.send();
}

var wantToGoAry = new Array();
var goingFrmAry = new Array();
var monthAry = new Array();
function loadDataToPage(result) {
	var data = result.Sheet1;
	var dataLen = data.length;
	var going = "<div class='leavingCnt'>";
	var leaving = "<div class='leavingCnt'>";
	var month = "<div class='leavingCnt'>";
	for(var res = 0;res < dataLen; res++){
		if(data[res].Going != undefined){
			going = going + "<div class='contentCls'><div class='lableCtnt' onClick='selectVal(\"locationSearchInpt\", \""+data[res].Going+"\");'>" + data[res].Going + "</div></div>";
			wantToGoAry.push(data[res].Going);
		}
		if(data[res].Leaving != undefined){
			leaving = leaving + "<div class='contentCls'><div class='lableCtnt' onClick='selectVal(\"goingFrmInput\", \""+data[res].Leaving+"\");'>" + data[res].Leaving + "</div></div>";
			goingFrmAry.push(data[res].Leaving);
		}
		if(data[res].Month != undefined){
			month = month + "<div class='contentCls'><div class='lableCtnt' onClick='selectVal(\"monthInput\", \""+data[res].Month+"\");'>" + data[res].Month + "</div></div>";
			monthAry.push(data[res].Month);
		}
	}
	going = going + "</div>";
	leaving = leaving + "</div>";
	month = month + "</div>";

	document.getElementById("wantToGoContent").innerHTML = going;
	document.getElementById("goingFrmContent").innerHTML = leaving;
	document.getElementById("monthContent").innerHTML = month;
}

function filterAry(inputId, searchType) {
	var ary, id;
	if(searchType == 'location') {
		ary = wantToGoAry;
		id = 'wantToGoContent';
	} else if(searchType == 'goingFrm') {
		ary = goingFrmAry;
		id = 'goingFrmContent';
	} else if (searchType == 'month'){
		ary = monthAry;
		id = 'monthContent';
	}
	var filterVal = document.getElementById(inputId).value;
	filterVal = filterVal.toUpperCase();
	var filteredNames = ary.filter(function(word) {
		word = word.toUpperCase();
       return word.includes(filterVal);
    });
	syncArray(id, filteredNames, inputId);
}
function syncArray(id, ary, inputId) {
	var aryLen = ary.length;
	var content = "<div class='leavingCnt'>";
	for(var index = 0;index < aryLen; index++){
		if(ary[index] != undefined){
			content = content + "<div class='contentCls'><div class='lableCtnt' onClick ='selectVal(\"" + inputId + "\",\""+ ary[index] +"\")'>" + ary[index] + "</div></div>";
		}
	}
	content = content + "</div>";
	var contentDOM = document.getElementById(id);
	contentDOM.innerHTML = '';
	contentDOM.innerHTML = content;
}
function selectVal(id, val) {
	document.getElementById(id).value = val; 
	if(id == "locationSearchInpt"){
		searchOnFocus();
	}
}
