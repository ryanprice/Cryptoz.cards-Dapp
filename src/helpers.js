export function dynamicSort(property, descending=true, isOpposite=false, modifyValue) {
  return function (a,b) {
      let valA = a[property], valB = b[property]
      let isDesc = descending
      //handle opposite
      if (isOpposite) isDesc = !isDesc
      //modify values first
      if (modifyValue) {
        valA = modifyValue(valA)
        valB = modifyValue(valB)
      }
      // turn into number
      if (!isNaN(valA) && !isNaN(valB)) {
        valA = Number.parseFloat(valA)
        valB = Number.parseFloat(valB)
      }
      if (typeof valA === "string" && typeof valB === "string") {
        valA = valA.toLowerCase()
        valB = valB.toLowerCase()
      }
      if(valA < valB) { return isDesc ? 1 : -1 }
      if(valA > valB) { return isDesc ? -1 : 1 }
      return 0;
  }
}

export function soldOutSort(a, b) {
    if (a.soldOut && b.soldOut) {
      return 0;
    }

    if (!a.soldOut && b.soldOut) {
      return -1;
    }

    if (a.soldOut && !b.soldOut) {
      return 1;
    }
}

export function getEditionNumber(val) {
  //lmao
  return val.split('#').slice(-1)[0].split(' ')[0]
}
export function getRarity(val) {
  return val.slice(-1)[0]
}
