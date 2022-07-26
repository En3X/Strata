/**
 * This is background script that runs when your extension is on youtube.
 * Author: @NamelessXDev aka @En3X
 */

const KEY = "<Insert your API key here>";

/**
 * If you do not have an API key, you can get one from here:
 *  -- https://developers.google.com/youtube/v3
 * This project uses Video:list API, you can find documentation here:
 *  -- https://developers.google.com/youtube/v3/docs/videos/list
 */

// This runs everytime the url changes or page changes

chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  if (info.status == "complete" && tab.active) {
    if (tab.url.includes("youtube.com/watch?v=")) {
      youtubeUrl = new URL(tab.url);
      params = new URLSearchParams(youtubeUrl.search);
      videoId = params.get("v");

      if (videoId == null || videoId == undefined || videoId == "") {
        return;
      } else {
        fetchData(videoId, tabId);
      }
    } else {
      return;
    }
  }
});

// This runs when you click on the tab again after visiting to some other tab or minimizing the window

chrome.tabs.onActivated.addListener((info) => {
  chrome.tabs.get(info.tabId, (tab) => {
    if (tab.url.includes("youtube.com/watch?v")) {
      youtubeUrl = new URL(tab.url);
      params = new URLSearchParams(youtubeUrl.search);
      videoId = params.get("v");
      fetchData(videoId, info.tabId);
    }
  });
});

function fetchData(videoId, tabId) {
  const ENDPOINT = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2Cstatistics&id=${videoId}&key=${KEY}`;

  fetch(ENDPOINT)
    .then((response) => response.json())
    .then((data) => {
      chrome.tabs.sendMessage(tabId, {
        id: videoId,
        command: "fetchData",
        data: data,
      });
    });
}
