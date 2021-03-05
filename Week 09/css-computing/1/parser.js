
// EOF: End Of File
const EOF = Symbol("EOF"); // 在 HTML 标准的描述里面也会有很多的遇到 EOF 该怎么办这样的一些描述，就用这个方法来完成在 JavaScript 里面的一个语言结构

// 不管 tag 多复杂 都是当作一个 token 去处理的，随着状态一个个的读进来字符的时候逐步的去构造 token 里面的内容
let currentToken = null;

let currentAttribute = null;

// 数据结构：让栈有一个初始的根节点好方便最后把这棵树拿出来
let stack = [{ type: "document", children: [] }];

// 表示当前正处于的文本节点
let currentTextNode = null;

const css = require("css");

// 加入一个新的函数，addCSSRules，把 CSS 规则暂存到一个数组里
let rules = [];
function addCSSRules(text) {
  var ast = css.parse(text);
  console.log(JSON.stringify(ast, null, "     "));
  rules.push(...ast.stylesheet.rules);
}

// 全局函数：最后这个状态机里面所有的状态创建完 token 之后，要在同一个出口输出
function emit(token) {

  // 取出栈顶
  let top = stack[stack.length - 1];  

  /**
   * tag 和 element 的概念：
   *  tag：写在 HTML 的文本里面的带尖括号的
   *  element：tag 背后所表示的那个东西抽象的概念
   * 
   * 所以 DOM 树里面只会有 note 和 element，不会有所谓的 tag
   */

  // 如果是 startTag
  if (token.type === "startTag") {
    // 就进行一个入栈操作
    let element = {
      type: "element",
      children: [],
      attributes: []
    }
    element.tagName = token.tagName;

    for (let p in token) {
      if (p !== "type" && p !== "tagName") {
        // push 到 element 属性池子里面
        element.attributes.push({
          name: p,
          value: token[p]
        });
      }
    }

    // 对偶的操作
    top.children.push(element);
    element.parent = top;

    // 不是自封闭的，startTag 的话 push 进去
    if (!token.isSelfClosing) stack.push(element);

    // 如果当前是刚刚结束一个标签，那么在开始标签和结束标签的 token 之后都会把文本节点清空
    currentTextNode = null;
  } else if (token.type === "endTag") {
    if (top.tagName !== token.tagName) {
      throw new Error("Tag start end doesn't match!");
    } else {
      // 遇到 style 标签时，执行添加 CSS 规则的操作
      if (top.tagName === "style") {
        // 拿出子元素文本节点，将内容作为 CSS 的内容添加到规则上去
        addCSSRules(top.children[0].content);
      }
      {
        // ...暂时先不做 link 标签的处理
      }
      // 相等的话表示配对成功
      stack.pop();
    }
    currentTextNode = null;
  } else if (token.type === "text") { // 文本处理逻辑
    if (currentTextNode === null) {
      // create new text node
      currentTextNode = {
        type: "text",
        content: ""
      }
      // 将文本节点作为 pop 目前节点的一个子节点 children
      pop.children.push(currentTextNode);
    }
    // 如果遇到任何一个字符型的 token 的逻辑
    currentTextNode.content += token.content;
  }
}

// 初始状态
function data(c) {
  // 是不是一个 tag
  if (c === "<") {
    return tagOpen;
  } else if (EOF) {
    emit({
      type: "EOF"
    });
    return;
  } else {
    // 一个一个字符的 emit 上去，后面构造树的时候再把 text 拼起来
    emit({
      type: "text",
      content: c
    })
    return data; // 忽略小于号以外的符号
  }
}

function tagOpen(c) {
  // 首先判断是不是结束标签
  if (c === "/") {
    return endTagOpen; // 结束标签的开头
    // 包含小写字母或者大写字母 要么是开始标签要么是自封闭标签
  } else if (c.match(/^[a-zA-Z]$/)) {
    // 没有遇到斜杠，大于号开头后面有字母...    
    currentToken = { // 在数据结构上，不管是不是自封闭的都会称作为 startTag，如果是自封闭的用一个额外的变量 isSelfClosing 来标识
      type: "startTag",
      tagName: ""
    }
    return tagName(c); // 收集 tagName 状态
  } else {
    return;
  }
}

function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "endTag",
      tagName: ""
    }
    return tagName(c);
    // 紧跟 > 报错
  } else if (c === ">") {

    // 同样报错
  } else if (c === EOF) {

  } else {

  }
}

// 核心逻辑：收到标签名组成的字符
function tagName(c) {
  // 以空白符结束的：\t \n \f 空格
  if (c.match(/^[\t\n\f ]$/)) { // tab 符、换行符、禁止符、空格
    return beforeAttributeName; // 遇到空格的时候表示结束进入到新的状态，比如 <html prop
  } else if (c === "/") { // 自封闭标签 </html>
    return selfClosingStartTag;
  } else if (c.match(/^[a-zA-Z]$/)) {
    // 当字符属于字母就追加到当前的 token 的 tagName 上面
    currentToken.tagName += c; // .toLowerCase()
    return tagName;
  } else if (c === ">") { // 普通的开始标签
    emit(currentToken);
    return data;
  } else {
    return tagName;
  }
}

// start：期待遇到一个属性名或者一个正斜杠之类的；end：进入到一系列处理属性的状态 比如 <html maaa="a" 空格的时候
function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === "/" || c === ">" || c === EOF) { // 可以作为终止标志
    // 进入这个状态并且 reconsume 这个当前的字符
    return afterAttributeName(c);
  } else if (c === "=") {

  } else {
    currentToken = {
      name: "",
      value: ""
    }
    return attributeName(c); // 创建新的属性，把当前的 c 去给它 reconsume 
  }
}

function attributeName(c) {
  // 后面三种特殊字符的状态+空格
  if (c.match(/^[\t\n\f ]$/) || c === "/" || c === ">" || c === EOF) { // 比如 <div class="a" 此时的空格就结束了，这个时候就会等一个大于号或者是斜杠大于号才能构成正常的标签结构
    return afterAttributeName(c);
    // attributeName 对应着一个 value 的
  } else if (c === "=") {
    return beforeAttributeValue;
  } else if (c === "\u0000") {

  } else if (c === "\"" || c === "'" || c === "<") {

  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/) || c === "/" || c === ">" || c === EOF) {
    return beforeAttributeValue;
  } else if (c === "\"") {
    return doubleQuotedAttributeValue;
  } else if (c === "\'") {
    return singleQuotedAttributeValue;
  } else if (c === "=") {
    // return data;
  } else {
    // 啥也没有也不是特殊的符号
    return UnquotedAttributeValue(c);
  }
}

// 只找双引号结束的
function doubleQuotedAttributeValue(c) {
  if (c === "\"") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === "\u0000") {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

// 只找单引号结束的
function singleQuotedAttributeValue(c) {
  if (c === "\'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === "\u0000") {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

// 不能直接接受一个字符创建一个属性的  比如：<div id="a" 的后面必须有一个空格  不然属性不合法
function afterQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === EOF) {

  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

// 只找空白符结束的
function UnquotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    // 所有的属性都会在结束的时候把 attributeName 和 attributeValue 给它写到当前的 currentToken
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c === "/") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === "\u0000") {

  } else if (c === "\"" || c === "'" || c === "<" || c === "=" || c === "`") {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c;
    return UnquotedAttributeValue;
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

function afterAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c === "=") {
    return beforeAttributeValue;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === EOF) {

  } else {
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
      name: "",
      value: ""
    }
    return attributeName(c);
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
  console.log(state);
  return stack[0];
}