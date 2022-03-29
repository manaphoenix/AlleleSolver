

function generateInfo(mats, max) {
  let infoBox = document.getElementById('allele_info')
  infoBox.innerHTML = ""
  let charInfo = []
  mats.forEach(arr => {
      arr.forEach(str => {
          let sortedStr = sortString(str)
          let pair = sortedStr.match(/.{1,2}/g)
          pair.forEach(x => {
              let charSymbol = x.substring(0,1).toUpperCase()
                if (/[A-Z]/.test(x)) {
                    charInfo[charSymbol] = (charInfo[charSymbol] || 0) + 1
                }
          })
      })
  });
  for (let prop in charInfo) {
      infoBox.innerHTML += `${prop}: ${charInfo[prop]}/${max} (${(charInfo[prop]/max)*100}%)<br>`
  }
}

function isUpper(str) {
    return !/[a-z]/.test(str) && /[A-Z]/.test(str);
}

function sortString(str) {
    let chars = []
    for (i = 0; i < str.length; i++) {
        let char = str.charAt(i);
        chars.push(char)
    }
    chars.sort((a, b) => a.localeCompare(b, 'en-US', {caseFirst: 'upper'}));
    return chars.join("");
}

function generateColorString(str) {
    let temp = ""
    for (i = 0; i < str.length; i++) {
        let char = str.charAt(i);
        if (isUpper(char)) {
            temp += `<span class="upper">${char}</span>`
        } else {
            temp += char
        }
    }
    return temp
}

function generateTable(pairA, pairB) {
  // make each side of the table
  let a = [''],
    b = ['']
  for (let i = 0; i < pairA.length; i += 2) {
    // duplicate every item in the arrays
    a = a.flatMap((n) => [n, n])
    b = b.flatMap((n) => [n, n])
    for (let j = 0; j < 2 ** (i / 2); j++) {
      a[j * 2] += pairA.at(i)
      a[j * 2 + 1] += pairA.at(i + 1)
      b[j * 2] += pairB.at(i)
      b[j * 2 + 1] += pairB.at(i + 1)
    }
  }
  // calculate table
  let mat = []
  for (let na in a) {
    mat[na] = []
    for (let nb in b) mat[na][nb] = a[na] + b[nb]
  }

  let rows = a.length + 1
  let cols = b.length + 1
  let table = document.getElementById('allele_table')
  table.innerHTML = ''

  generateInfo(mat, a.length*b.length)
  for (var i = 0; i < rows; i++) {
    let row = table.insertRow(i)
    for (var c = 0; c < cols; c++) {
      let cell = row.insertCell(c)
      if (c == 0 && i == 0) {
        cell.innerHTML = `<span class="tableName">${pairA} x ${pairB}</span>`
      } else if (i == 0 && c > 0) {
        cell.innerHTML = `<span class="tableName">${a[c - 1]}</span>`
      } else if (i > 0 && c == 0) {
        cell.innerHTML = `<span class="tableName">${b[i - 1]}</span>`
      } else {
        let txt = sortString(mat[c - 1][i - 1])
        let out = generateColorString(txt)

        cell.innerHTML = `${out}`
      }
    }
  }
}

function generatePairs() {
  let pairA = document.getElementById('PairA').textContent
  let pairB = document.getElementById('PairB').textContent

  if (pairA.length == 0 || pairB.length == 0) return
  if (pairA.length % 2 != 0 || pairB.length % 2 != 0) return

  
  generateTable(pairA, pairB)
}
