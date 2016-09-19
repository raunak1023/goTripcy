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
	var url = "resources/excel/data.xlsx";
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
	
	setInterval(displayBG, 5000); 
}

var wantToGoAry = new Array();
var goingFrmAry = new Array();
var monthAry = new Array();
function loadDataToPage(result) {
	var searchData = result.search;
	var outboundData = result.outbound;
	var inboundData = result.inbound;
	var trendingData = result.trending;
	var searchDataLen = searchData.length;
	var going = "<div class='leavingCnt'>";
	var leaving = "<div class='leavingCnt'>";
	var month = "<div class='leavingCnt'>";
	for(var res = 0;res < searchDataLen; res++){
		if(searchData[res].Going != undefined){
			going = going + "<div class='contentCls'><div class='lableCtnt' onClick='selectVal(\"locationSearchInpt\", \""+searchData[res].Going+"\", \"wantToGoContent\");'>" + searchData[res].Going + "</div></div>";
			wantToGoAry.push(searchData[res].Going);
		}
		if(searchData[res].Leaving != undefined){
			leaving = leaving + "<div class='contentCls'><div class='lableCtnt' onClick='selectVal(\"goingFrmInput\", \""+searchData[res].Leaving+"\", \"goingFrmContent\");'>" + searchData[res].Leaving + "</div></div>";
			goingFrmAry.push(searchData[res].Leaving);
		}
		if(searchData[res].Month != undefined){
			month = month + "<div class='contentCls'><div class='lableCtnt' onClick='selectVal(\"monthInput\", \""+searchData[res].Month+"\", \"monthContent\");'>" + searchData[res].Month + "</div></div>";
			monthAry.push(searchData[res].Month);
		}
	}
	going = going + "</div>";
	leaving = leaving + "</div>";
	month = month + "</div>";

	document.getElementById("wantToGoContent").innerHTML = going;
	document.getElementById("goingFrmContent").innerHTML = leaving;
	document.getElementById("monthContent").innerHTML = month;
	
	displayOutbound(outboundData);
	displayInbound(inboundData);
	displayTrending(trendingData);
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
			content = content + "<div class='contentCls'><div class='lableCtnt' onClick ='selectVal(\"" + inputId + "\",\""+ ary[index] +"\",\""+id+"\" )'>" + ary[index] + "</div></div>";
		}
	}
	content = content + "</div>";
	var contentDOM = document.getElementById(id);
	contentDOM.innerHTML = '';
	contentDOM.innerHTML = content;
}
function selectVal(id, val, contentId) {
	document.getElementById(id).value = val; 
	if(id == "locationSearchInpt"){
		searchOnFocus();
	}
	document.getElementById(contentId).style.display = 'none';
}

function displayOutbound(outboundData){
	var outboundDataLen = outboundData.length;
	for(var index = 1;index <= outboundDataLen; index++){
		var imageId = "pkg_out_img_"+index;
		var headId = "pkg_out_head_"+index;
		var descId = "pkg_out_desc_"+index;
		var priceId = "pkg_out_price_"+index;
		document.getElementById(imageId).src = "resources/images/pakages/" + outboundData[index-1].image + ".jpg";
		document.getElementById(headId).innerHTML = outboundData[index-1].package_name + "<small>"+ outboundData[index-1].cities_included +"</small>";
		document.getElementById(descId).innerHTML = outboundData[index-1].inclusion;
		document.getElementById(priceId).innerHTML = outboundData[index-1].price;
	}
}

function displayInbound(inboundData){
	var inboundDataLen = inboundData.length;
	for(var index = 1;index <= inboundDataLen; index++){
		var imageId = "pkg_in_img_"+index;
		var headId = "pkg_in_head_"+index;
		var descId = "pkg_in_desc_"+index;
		var priceId = "pkg_in_price_"+index;
		document.getElementById(imageId).src = "resources/images/pakages/" + inboundData[index-1].image + ".jpg";
		document.getElementById(headId).innerHTML = inboundData[index-1].package_name + "<small>"+ inboundData[index-1].cities_included +"</small>";
		document.getElementById(descId).innerHTML = inboundData[index-1].inclusion;
		document.getElementById(priceId).innerHTML = inboundData[index-1].price;
	}
}

function displayTrending(trendingData){
	var displayTreandingLen = trendingData.length;
	for(var index = 1;index <= displayTreandingLen; index++){
		var imageId = "pkg_trend_img_"+index;
		var headId = "pkg_trend_head_"+index;
		var descId = "pkg_trend_desc_"+index;
		var priceId = "pkg_trend_price_"+index;
		document.getElementById(imageId).src = "resources/images/pakages/" + trendingData[index-1].image + ".jpg";
		document.getElementById(headId).innerHTML = trendingData[index-1].package_name + "<small>"+ trendingData[index-1].cities_included +"</small>";
		document.getElementById(descId).innerHTML = trendingData[index-1].inclusion;
		document.getElementById(priceId).innerHTML = trendingData[index-1].price;
	}
}
var bgIndex = 0;
function displayBG() {
	document.getElementById("search-tab-content-id").style.backgroundImage = "url(resources/images/backgroundImages/" + (++bgIndex) + ".jpg)";
	if(bgIndex >= 5){
		bgIndex = 0;
	}
}

function showDest(){
	//tjq('searchPanelId').addClass('displayNone');
	document.getElementById('searchPanelId').style.display = "block"
	document.getElementById('downArrowDest').style.display = "none"
	document.getElementById('upArrowDest').style.display = "inline-block"
}

function hideDest(){
//	tjq('searchPanelId').removeClass('displayNone');
	document.getElementById('searchPanelId').style.display = "none"
	document.getElementById('downArrowDest').style.display = "inline-block"
	document.getElementById('upArrowDest').style.display = "none"
}

function showHideQuoteContent() {
	var imgIconDiv = document.getElementById('helpIconDiv');
	var quoteContent = document.getElementById('quoteContent');
	var queryDiv = document.getElementById('queryDiv');
	var quoteClass = quoteContent.className;
	if(quoteClass.indexOf('display_None') > 0){
		quoteContent.className = "col-md-8 col-xs-8 quoteContentDiv";
		imgIconDiv.className = "col-md-4 col-xs-4";
		queryDiv.className = "row queryContent quoteContentShow";
	} else {
		quoteContent.className = "col-md-6 col-xs-6 display_None quoteContent";
		imgIconDiv.className = "col-md-12 col-xs-12";
		queryDiv.className = "row queryContent";
	}
}

function sendQuote(){
	var userName = document.getElementById('userName').value;
	var userNumber = document.getElementById('userNumber').value;
	tjq.ajax({
		type: "POST",
		url: contextPath + "/handleServlet",
		data: 'userName='+userName+'&userNumber='+userNumber+'&processAction=sendMail',
		success: function(result){
        alert('done');
    }});
}