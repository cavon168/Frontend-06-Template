function match(string) {
  let foundA = false;
  let foundB = false;
  let foundC = false;
  let foundD = false;
  let foundE = false;
  for (let c of string) {
    if (c == "a") {
      foundA = true;
    }
    else if (c == "b") {
      foundB = true;
    }
    else if (c == "c") {
      foundC = true;
    }
    else if (c == "d") {
      foundD = true;
    }
    else if (c == "e") {
      foundE = true;
    }
    else if (c == "f") {
      return true;
    }
    else {
      foundA = false;
      foundB = false;
      foundC = false;
      foundD = false;
      foundE = false;
    }
  }
  return false;
}

console.log(match("i mabcdefg groot"));