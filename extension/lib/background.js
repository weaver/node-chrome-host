define(['./client'], function(Client) {

  var client = Client.createConnection(8000);

  client
    .on('message', function(data) {
      console.log('message', data);
      if (data.type == 'capture')
        capture(data.url);
    });

  function capture(url) {
    chrome.tabs.create({ url: url },
      function(tab) {
        setTimeout(function() { captureVisible(tab); }, 2000);
      });
  }

  function captureVisible(tab) {
    chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' },
      function(uri) {
        chrome.tabs.remove(tab.id, function() {
          client.send({ type: 'captured', data: uri });
        });
    });
  }
});
