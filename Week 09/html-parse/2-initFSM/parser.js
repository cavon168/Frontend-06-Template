
// EOF: End Of File
const EOF = Symbol("EOF"); // 在 HTML 标准的描述里面也会有很多的遇到 EOF 该怎么办这样的一些描述，就用这个方法来完成在 JavaScript 里面的一个语言结构

// 初始状态
function data() {

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