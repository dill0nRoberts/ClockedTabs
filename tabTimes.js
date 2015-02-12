var tabText = "";

function main()
{
	chrome.runtime.sendMessage({times: "tabTimes"}, 
	function(response)
	{
		tabText = tabText.concat(response);
	});
	document.write(tabText);
}

document.onready = main;