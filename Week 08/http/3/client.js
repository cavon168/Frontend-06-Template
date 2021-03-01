const net = require("net");

class Request {
  constructor(options) {
    this.method = options.method || "GET";
    this.host = options.host;
    this.port = options.port || 80;
    this.path = options.path || "/";
    this.body = options.body || {};
    this.headers = options.headers || {};
    if (!this.headers["Content-Type"]) {
      this.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }
    if (this.headers["Content-Type"] === "application/json") {
      this.bodyText = JSON.stringify(this.body);
    }
    else if (this.headers["Content-Type"] === "application/x-www-form-urlencoded") {
      this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join("&");
    }
    this.headers["Content-Length"] = this.bodyText.length;
  }
  // 在已经建立好的 TCP 连接上把请求发出去
  send(connection) {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser;
      if (connection) {
        connection.write(this.toString());
      }
      // 如果没有传根据自己的 host、port 去创建一个新的 TCP 连接
      else {
        connection = net.createConnection({
          host: this.host,
          port: this.port
        }, () => { // 创建成功回调
          connection.write(this.toString());
        });
      }
      connection.on("data", data => {
        console.log(data.toString());
        parser.receive(data.toString());
        // parser 结束
        if (parser.isFinished) {
          // 结束掉整个 Promise
          resolve(parser.response);
          connection.end();
        }
      });
      connection.on("error", err => {
        reject(err);
        connection.end();
      });
      console.log(connection);
    });
  }
  toString() {

    console.log(this.bodyText);
    return `${this.method} ${this.path} HTTP/1.1\r

${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join(`\r\n`)}\r
\r
${this.bodyText}`;
  }
}
class ResponseParser {
  constructor() {

  }
  receive(string) {
    for (let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i));
    }
  }
  receiveChar(char) {

  }
}

void async function () {
  let request = new Request({
    method: "POST",
    host: "127.0.0.1",
    port: "8088",
    path: "/",
    headers: {
      ["X-Foo2"]: "customed"
    },
    body: {
      name: "cavon"
    }
  });
  let response = await request.send();
  console.log("response:", response);
}();