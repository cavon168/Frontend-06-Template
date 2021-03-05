
let currentToken = null;

// EOF: End Of File
const EOF = Symbol("EOF"); // 在 HTML 标准的描述里面也会有很多的遇到 EOF 该怎么办这样的一些描述，就用这个方法来完成在 JavaScript 里面的一个语言结构

// 初始状态
function data(c) {
  // 是不是一个 tag
  if (c === "<") {
    return tagOpen;
  } else if (EOF) {
    return;
  } else {
    return data; // 忽略小于号以外的符号
  }
}

function tagOpen(c) {
  // 首先判断是不是结束标签
  if (c === "/") {
    return endTagOpen; // 结束标签的开头
    // 包含小写字母或者大写字母 要么是开始标签要么是自封闭标签
  } else if (c.match(/^[a-zA-Z]$/)) {
    return tagName(c); // 收集 tagName 状态
  } else {
    return;
  }
}

function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    return tagName(c);
    // 紧跟 > 报错
  } else if (c === ">") {

    // 同样报错
  } else if (c === EOF) {

  } else {

  }
}

function tagName(c) {
  // 以空白符结束的：\t \n \f 空格
  if (c.match(/^[\t\n\f ]$/)) { // tab 符、换行符、禁止符、空格
    return beforeAttributeName; // 遇到空格的时候表示结束进入到新的状态，比如 <html prop
  } else if (c === "/") { // 自封闭标签 </html>
    return selfClosingStartTag;
  } else if (c.match(/^[a-zA-Z]$/)) {
    return tagName;
  } else if (c === ">") { // 普通的开始标签
    return data;
  } else {
    return tagName;
  }
}

// 期待遇到一个属性名或者一个正斜杠之类的
function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === ">") { // 可以作为终止标志
    return data;
  } else if (c === "=") {
    return beforeAttributeName;
  } else {
    return beforeAttributeName;
  }
}

// 分析标签
function selfClosingStartTag(c) {
  // 此时已经分析到一个杠了  后面就只有大于号是有效的 其他的都会报错
  if (c === ">") {
    currentToken.isSelfClosing = true;
    return data;
  } else if (c === EOF) {

  } else {

  }
}

// the placeholder function
module.exports.parseHTML = function parseHTML(html) {
  // 初始状态
  let state = data;
  for (let c of html) {
    // 循环，调用每个状态机
    state = state(c);
  }
  // 由于 html 最后是有一个文件终结的，在文件终结的位置，比如文本节点，它可能仍任是面临着一个没有结束的状态。
  // 所以最后必须要额外给它一个字符，而这个字符不能是任何一个有效的字符。
  // 利用 Symbol 的唯一特性，创建一个新的 EOF 作为状态机的最后一个输入给到状态机。
  // 这样最后状态机就会强怕一些节点完成截止的标志。
  state = state(EOF);
  console.log(html);
}