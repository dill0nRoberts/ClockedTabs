var tabText = "";
chrome.runtime.sendMessage({times: "tabTimes"}, 
	function(response)
	{
		tabText = tabText.concat(response._js_tabTimes);
	});
alert(tabText);