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
		var rates = searchPkg[i].Rates;
		html = html + '<article class="box">'+
			'<figure class="col-sm-5 col-md-4">'+
		        '<img width="270" height="160" alt="" src="'+pkgImage+'">'+
		    '</figure>'+
		    '<div class="details col-sm-7 col-md-8">'+
		        '<div>'+
		            '<div>'+
		                '<h4 class="box-title">'+pkgName+'<small><i class="soap-icon-departure yellow-color"></i>'+citiesCovered+'</small></h4>'+
		                '<div class="amenities">'+
		                    '<i class="soap-icon-wifi circle"></i>'+
		                    '<i class="soap-icon-fitnessfacility circle"></i>'+
		                    '<i class="soap-icon-fork circle"></i>'+
		                    '<i class="soap-icon-television circle"></i>'+
		                '</div>'+
		            '</div>'+
		            '<div>'+
		                '<div class="five-stars-container">'+
		                    '<span class="five-stars" style="width: 80%;"></span>'+
		                '</div>'+
		                '<span class="review">270 reviews</span>'+
		            '</div>'+
		        '</div>'+
		        '<div>'+
		            '<p>'+otherInclusions+'</p>'+
		            '<div>'+
		                '<span class="price"><small>AVG/NIGHT</small><span class="fa fa-inr">'+rates+'<span></span>'+
		                '<a class="button btn-small full-width text-center" title="" href="">SELECT</a>'+
		            '</div>'+
		        '</div>'+
		    '</div>'+
		'</article>';
	}
	console.log(html);
    document.getElementById('dispSearchRes').innerHTML = html;
}