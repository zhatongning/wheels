// https://github.com/jamiebuilds/the-super-tiny-compiler/blob/master/the-super-tiny-compiler.js
// https://astexplorer.net/

// const arrowfunction = () => { console.log('hello compiler') }

const keywords = ["const", "let", "var"]

const tokenizer = (input) => {
  let current = 0
  let tokens = []
  let value = ""

  while (current < input.length) {
    let char = input[current]

    if (/\s/.test(char)) {
      console.log(1)
      current++
      continue
    }

    if (/\(|\)/.test(char)) {
      console.log(2)
      tokens.push({
        type: "paren",
        value: char,
      })
      current++
      continue
    }

    if (char === "=") {
      console.log(8)
      char = input[++current]
      if (char === ">") {
        tokens.push({
          type: "arrowfuntion",
          value: "=>",
        })
        current++
      } else {
        tokens.push({
          type: "equal",
          value: "=",
        })
      }
      continue
    }

    if (/\{|\}/.test(char)) {
      console.log(3)
      tokens.push({
        type: "brace",
        value: char,
      })
      current++
      continue
    }

    if (char === ".") {
      console.log(4)
      tokens.push({
        type: "dot",
        value: char,
      })
      current++
      continue
    }

    if (char === "'") {
      console.log(5)
      value += char
      char = input[++current]
      while (char !== "'") {
        value += char
        char = input[++current]
      }
      value += char
      tokens.push({
        type: "string",
        value,
      })
      current++
      value = ""
      continue
    }

    if (/[a-z]/i.test(char)) {
      console.log(6)
      value += char
      char = input[++current]
      while (/[a-z]/i.test(char)) {
        value += char
        char = input[++current]
      }
      if (keywords.includes(value)) {
        tokens.push({
          type: "keywords",
          value,
        })
      } else {
        tokens.push({
          type: "name",
          value,
        })
      }
      value = ""
    }
  }
  return tokens
}

console.log(
  tokenizer("const arrowfunction = () => { console.log('hello compiler') }")
)
