;(function (exports) {

function xhr(url, data, format) {
  return new Promise(function (resolve, reject) {

    var req = new XMLHttpRequest();

    req.open('GET', url);

    req.responseType = format || 'json';

    req.onload = function () {
      var response = 'response' in req ? req.response : req.responseText;

      if (typeof response !== 'object') {
        try {
          data = JSON.parse(response);
        } catch (e) {
          return reject(Error(req.statusText));
        }
      }

      // It could be a successful response but not an OK one (e.g., 3xx, 4xx).
      if (req.status === 200) {
        return resolve(response);
      } else {
        return reject(Error(req.statusText));
      }
    };

    req.onerror = function (err) {
      return reject(Error('Network Error'));
    };

    req.send(data);

  });
}

exports.xhr = xhr;

})(window);
