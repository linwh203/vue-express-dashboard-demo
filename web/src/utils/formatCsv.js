export function formatCsv(source) {
  if (source && source.length) {
    const ret = {}
    const keys = source.shift()
    keys.forEach(k => {
      ret[k] = ""
    })
    for(let keyName of ret) {
      source.forEach((s, i) => {
        
      })
    }
  }
  return {
    source
  }
}