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