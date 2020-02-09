const fs = require('fs');

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<title>Enter message</title>');
    res.write(
      '<body><form action="/message" method="POST"><input type="text" /><button type="submit" name="message">Send</button></form></body>'
    );
    return res.end();
  }
  if (url === '/message' && method === 'POST') {
    // Get the request data that we wanna save to the file
    // register an event listener, 'on' allows us to listen to certain events
    // The data event is fired whenever a new chunk of data is ready to be read
    const body = [];
    req.on('data', chunk => {
      // This is the function that should be executed for every incoming data piece(chunk)
      // We can then do something with the chunk
      console.log(chunk);
      body.push(chunk);
    });
    // Register another event listener that gets fired after our entire chunk is read.
    return req.on('end', () => {
      // We now need to buffer the chunks of data
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1];
      // create a new file and store the message the user input in the input field inside of this file
      fs.writeFile('./message.txt', message, err => {
        // This function will be executed when the file has been written
        if (err) console.log(err);
        // redirect the user to the root
        // res.writeHead(302, 'redirect', {'Location': '/'})
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
      });
    });
  }
};

exports = {
  requestHandler,
};
