function match(string) {
  let state = start;
  for (let c of string) {
    // 把状态切到下一个状态
    state = start(c);
  }
  // 是不是已经找到了所有的状态
  return state === end;
}

function start(c) {
  if (c === "a") {
    return foundA;
  } else {
    return start;
  }
}

function end(c) {
  // 小技巧（trap）：让 end 状态永远返回 end，一旦进入到 end 状态就再也不会进别的状态
  return end;
}

function foundA(c) {
  if (c === "b") {
    return foundB;
  } else {
    return start(c); // 重新使用的逻辑 —— reConsume 逻辑
  }
}

function foundB(c) {
  if (c === "c") {
    return foundC;
  } else {
    return start(c);
  }
}

function foundC(c) {
  if (c === "d") {
    return foundD;
  } else {
    return start(c);
  }
}

function foundD(c) {
  if (c === "e") {
    return foundE;
  } else {
    return start(c);
  }
}

function foundE(c) {
  if (c === "f") {
    // 结束状态
    return end;
  } else {
    return start(c);
  }
}

console.log(match("i mabcdefgroot"));

