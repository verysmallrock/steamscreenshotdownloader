downloadURI = function(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}

makeRequest = function(method, url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.responseText);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send();
  });
}


var steamImageUrls = [];

getUrlFromResponse = function(responseText) {
  window.resp = responseText;
  var linkRegex = new RegExp('https://steamuserimages[^\"]+');
  var url = linkRegex.exec(window.resp)[0];
  steamImageUrls.push(url);
  console.log(url);
  return url;
}

var urls = [];
jQuery('a.profile_media_item.modalContentLink').each(function(index, el) {
	urls.push(el.href);
});

for (var i = 0; i < urls.length; ++i) {
	makeRequest("GET", urls[i])
	.then( function(text) {
		var imageUrl = getUrlFromResponse(text);
		downloadURI(imageUrl, 'image' + i + '.jpg');
	});
}
