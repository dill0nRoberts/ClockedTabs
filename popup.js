var tabText = "";

function main()
{
	chrome.runtime.sendMessage({times: "tabTimes"}, 
	function(response)
	{
		tabText = tabText.concat(response);
	});
	document.getElementById("stupidDiv").innerText = tabText;
}

window.setTimeout(main, 3000);