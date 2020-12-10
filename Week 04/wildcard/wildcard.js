function find(source, pattern) {
  let starCount = 0;
  // 循环整个 pattern 字符串，找出来有多少个星号
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === "*") starCount++;
  }

  // 处理边缘 case 没有星号的情况：字符串跟 pattern 严格的一一匹配
  if (starCount === 0) {
    // 访问整个 pattern
    for (let i = 0; i < pattern.length; i++) {
      // 除了问号可以匹配任何字符
      if (pattern[i] !== source[i] && pattern[i] !== "?")
      // 其他符号 过
        return false;

    }

    return;
  }

  // 表示 pattern 的位置
  let i = 0;
  // 表示原字符串的 source 的位置
  let lastIndex = 0;

  // 处理第一个星号之前的部分，给它匹配完
  for (i = 0; pattern[i] !== "*"; i++) {

    if (pattern[i] !== source[i] && pattern[i] !== "?") return false;

  }
  // 更新
  lastIndex = i;

  // 循环每一段每一个星号，白色的部分每个星号跟着一个模式串
  for (let p = 0; p < starCount - 1; p++) { // starCount - 1：只有一个星号就当作最后一个星号处理
    i++;

    // 星号后边的格式
    let subPattern = "";
    // 找到星号
    while (pattern[i] !== "*") {
      subPattern += pattern[i];
      i++;
    }

    // 将 subPattern 问号全都替换成正则表达式的语法即任意字符("[\\s\\S]")
    let reg = new RegExp(subPattern.replace(/\?/g, "[\\s\\S]"), "g");
    reg.lastIndex = lastIndex;

    // console.log(reg.exec(source));

    // 匹配不到
    if (!reg.exec(source)) return false;

    lastIndex = reg.lastIndex;
  }

  // 尾巴的匹配：最后一个星号后边的部分
  for (let j = 0; j < source.length - lastIndex && pattern[pattern.length - j] !== "*"; j++) {

    if (pattern[pattern.length - j] !== source[source.length - j] && pattern[pattern.length - j] !== "?") return false;

  }

  return true;
}

// find("abcabcabxaac", "a*b*bx*c");
console.log(find("abcabcabxaac", "a*b?*b?x*c"));


// 额外思考题：正则表达式是否可以用一个带问号的 KMP 算法去替代