var eraseIntval_d;
var eraseIntval_s;
var erase_times_d = 0;
var erase_times_s = 0;

chrome.runtime.onStartup.addListener(_onStartup);
chrome.downloads.onChanged.addListener(_onChanged);

if (chrome.downloads.setShelfEnabled) chrome.downloads.setShelfEnabled(false);

function _onStartup() {
  eraseIntval_d = window.setInterval(_downloads_history_erase, 3000);
  eraseIntval_s = window.setInterval(_google_history_erase, 2500);
}

function _downloads_history_erase() {
  chrome.downloads.erase({});
  if (++erase_times_d >= 2) window.clearInterval(eraseIntval_d);
}

function _onChanged() {
  chrome.downloads.search({}, function (items) {
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.state == "complete") chrome.downloads.erase({ id: item.id });
    }
  });
}

function _google_history_erase() {
  chrome.history.search({ text: "google.com/search" }, function (items) {
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      chrome.history.deleteUrl({ url: item.url });
    }
  });
  if (++erase_times_s >= 2) window.clearInterval(eraseIntval_s);
}
