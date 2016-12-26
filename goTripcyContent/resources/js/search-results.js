function onLoadPage() {
	var url = "../excel/data.xlsx";
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

function to_json(workbook) {
    var result = {};
    workbook.SheetNames.forEach(function(sheetName) {
        var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        if(roa.length > 0){
            result[sheetName] = roa;
        }
    });
    loadSearchResults(result);
}

var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  } 
  return query_string;
}();
	
function loadSearchResults(result) {
	var searchResultsData = result.searchresults;
	var searchPkg = new Array();
	for(var index=0; index<searchResultsData.length; index++) {
		if(searchResultsData[index].Search_keys.indexOf(QueryString.search) >= 0){
			searchPkg.push(searchResultsData[index]);
		}
	}
	var html = '';
	for(var i = 0; i < searchPkg.length; i++){
		var pkgImage = "../images/pakages/" + searchPkg[i].Image + ".jpg";
		var pkgName = searchPkg[i].Package_Name;
		var citiesCovered = searchPkg[i].Cities_covered;
		var otherInclusions = searchPkg[i].Other_Inclusions;
		var otherIncAry = otherInclusions.split(';;;');//
		var incList = '';
		for(var j=0;j<otherIncAry.length;j++) {
			incList = incList + '\u2022  ' + otherIncAry[j] + '</br>'; 
		}
		var pkgCat = searchPkg[i].Package_category;
		var pkgCatAry = pkgCat.split(';;;');
		var options = '';
		for(var k=0; k < pkgCatAry.length; k++){
			options = options + '<option value="'+pkgCatAry[k]+'">'+pkgCatAry[k]+'</option>';
		}
		var rates = searchPkg[i].Rates;
		var ratesAry = rates.split(';;;');
		var rate = ratesAry[0];
		html = html + '<article class="box">'+
			'<figure class="col-sm-5 col-md-4">'+
		        '<img width="270" height="160" alt="" src="'+pkgImage+'">'+
		    '</figure>'+
		    '<div class="row col-sm-7 col-md-8" style="margin-left: 10px;margin-top: 10px;"> '+
		        '<div class="row">'+
		            '<div class="col-sm-9 col-md-9" style="margin-bottom: 30px;">'+
		                '<h4 class="box-title">'+pkgName+'<small><i class="soap-icon-departure yellow-color"></i>'+citiesCovered+'</small></h4>'+
		                '<div class="amenities">'+
		                    '<i class="soap-icon-wifi circle"></i>'+
		                    '<i class="soap-icon-fitnessfacility circle"></i>'+
		                    '<i class="soap-icon-fork circle"></i>'+
		                    '<i class="soap-icon-television circle"></i>'+
		                '</div>'+
		            '</div>'+
		            '<div class="col-sm-3 col-md-3">'+
		                '<div>'+
			                '<select onchange="changeDet(this,\''+rates+'\');">'+
			                	options +
			                '</select>'+
		                '</div>'+
		            '</div>'+
		        '</div>'+
		        '<div class="row">'+
		        	'<div class="col-sm-12 col-md-12">'+
			            '<p class="col-sm-6 col-md-6">'+incList+'</p>'+
			            '<div class="col-sm-6 col-md-6">'+
			                '<span class="price"><small>AVG/NIGHT</small><span class="fa fa-inr">'+rate+'<span></span>'+
			                '<a class="button btn-small full-width text-center" title="" href="">SELECT</a>'+
			            '</div>'+
		            '</div>'+
		        '</div>'+
		    '</div>'+
		'</article>';
	}
    document.getElementById('dispSearchRes').innerHTML = html;
}

function changeDet(dd, ary) {
	console.log(tjq(dd).val());
}