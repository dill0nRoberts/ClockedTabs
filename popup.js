var tabText = "";

function main()
{
	setTimeout(function(){
	document.getElementById("stupidDiv").innerText = tabText;
	}, 2000); // execute after chrome sends string back
	chrome.runtime.sendMessage({times: "tabTimes"}, 
	function(response)
	{
		tabText = tabText.concat(response);
	});
}

window.onload = main;