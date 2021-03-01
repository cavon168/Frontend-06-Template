const net = require("net");

class Request {
  constructor(options) {
    this.method = options.method || "GET";
    this.host = options.host;
    this.port = options.port || 80;
    this.path = options.path || "/";
    this.body = options.body || {};
    this.headers = options.headers || {};
    // 必须要有 Content-Type，不然 body 没办法解析
    if (!this.headers["Content-Type"]) {
      this.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }
    // 2 种简单的编码格式
    if (this.headers["Content-Type"] === "application/json") {
      this.bodyText = JSON.stringify(this.body);
    } else if (this.headers["Content-Type"] === "application/x-www-form-urlencoded") {
      // 简单的 HTTP 保存
      this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&');
    }
    // 不推荐设计成可以从外面传，一定是从 body 的 text 里面最后取一个 length 出来
    this.headers["Content-Length"] = this.bodyText.length;
  }
  send() {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
}

// 两步式的结构
void async function () {
  // 创建 HTTP
  let request = new Request({
    method: "POST", // HTTP 协议
    host: "127.0.0.1", // 来自 IP 层
    port: "8088", // TCP 协议
    path: "/", // HTTP 协议
    headers: { // HTTP 协议
      ["X-Foo2"]: "customed"
    },
    body: {
      name: "cavon"
    }
  });
  // 请求结束，返回 promise
  let response = await request.send();
  console.log("response:", response);
}();


