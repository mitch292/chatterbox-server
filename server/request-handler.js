/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var messages = [];

var requestHandler = function(request, response) {
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  // The outgoing status.
  var statusCode = 200;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  var routes = {
    '/classes/messages/GET': true,
    '/classes/messages/POST': true,
    '/classes/messages': true
  }



  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.


  if (request.method === 'POST') {
    let body = '';
    request.on('data', (chunk)=> {
      body += chunk.toString()
      messages.push(JSON.parse(body));
    } )
    statusCode = 201;
  }
  if (!routes[request.url]) {
    statusCode = 404;
  }

  response.writeHead(statusCode, headers);

  responseBody = {
    headers: headers,
    method: response.method,
    url: response.url,
    body: response.body,
    results: messages
  }

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  response.end(JSON.stringify(responseBody));
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};

exports.requestHandler = requestHandler;
