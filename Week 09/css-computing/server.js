const http = require("http");

const server = http.createServer((request, response) => {
  console.log("request received");
  console.log(request.headers);
  request.setHeader("Content-Type", "text/html");
  request.setHeader("X-Foo", "bar");
  request.writeHead(200, { "Content-Type": "text/plain" });
  request.end(
    `<html maaa="a">
      <head>
        <style>
          body div #myid {
            width: 100px;
            background-color: #ff5000;
          }
          body div img {
            width: 300px;
            background-color: #ff1111;
          }
        </style>
      </head>
      <body>
        <div>
          <img id="myid" />
          <img />
        </div>
      </body>
    </html>`
  );
});

server.listen(8088);

console.log("start server");