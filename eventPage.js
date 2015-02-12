var _closedTimes = new Map();
var _tabTimes = new Map();

var _currentTabId = undefined;
var _currentActivateTime = undefined;

var _js_tabTimes = "";

function tabTimes(tabId)
{
	this.tabId = tabId;
	this.createTime = new Date();
	this.elapsedTime = 0;
	this.lastActiveTime = undefined;
}



// timestampTabCreation(tab) records the time of creation of tab into creationTimes

function timestampTabCreation(tab)
{
	_tabTimes.set(tab.id, new tabTimes(tab.id));
}


// init(result) gets all tabs not in _tabTimes in result and puts them into _tabTimes

function init(result)
{
	var k;
	for(k = 0; k < result.length; k++)
	{
		if(!_tabTimes.has(result[k].id))
		{
			timestampTabCreation(result[k]);
		}
	}
}

// timestampTabActivated(activeInfo) records the time the old tab was active for and sets the activation time for the current tab.

function timestampTabActivated(activeInfo)
{
	if(_currentTabId!==undefined)
	{
		if(_tabTimes.has(activeInfo.tabId))
		{
			var oldTab = _tabTimes.get(activeInfo.tabId);
			oldTab.elapsedTime += (Date.now()/60000 - _currentActivateTime.getTime()/60000);
			_tabTimes.set(activeInfo.tabId, oldTab);
		}
		else
		{
			timestampTabCreation(activeInfo.tabId);
		}
	}
	_currentTabId = activeInfo.tabId;
	_currentActivateTime = new Date();
}


// removeTab(tabid, removeInfo) records the time a tab was removed into closedTimes.

function removeTab(tabId, removeInfo)
{
	_tabTimes.delete(tabId);
}


// getTabTimes(item, key) returns a string containing the

function getTabTimes(tabTime, tabID, times)
{
	if(tabID!==undefined)
	{
		_js_tabTimes = _js_tabTimes.concat("Tab " + tabID.toString() + "\n"
		+ "\t time active: " + tabTime.elapsedTime.toString() + "\n"
		+ "\t time created: " + tabTime.createTime.toString() + "\n");	
	}
}


// onPopup(request, sender, sendResponse) sends a string of the currently tracked tabs

function onPopup(request, sender, sendResponse)
{
	if(request.times=="tabTimes")
	{
		_js_tabTimes = "";
		_tabTimes.forEach(getTabTimes);
		sendResponse(_js_tabTimes);
	}
}

// initialize all tabs into _tabTimes

chrome.tabs.query({windowType: "normal"}, init);


// check for tab switches, creation, and deletion. Creation does not imply a tab switch.

chrome.tabs.onCreated.addListener(timestampTabCreation);
chrome.tabs.onRemoved.addListener(removeTab);
chrome.tabs.onActivated.addListener(timestampTabActivated);


// listen for requests for tabTimes from popup

chrome.runtime.onMessage.addListener(onPopup);