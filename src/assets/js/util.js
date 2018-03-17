(function () {
  this.strLimit = function (args) {
    var str = args[0]
    var limit = args[1]
    var result = str.length <= limit ? str : str.substring(0, limit - 1) + '...'
    return result
  }
  this.randomSubscColors = function () {
    var result = []
    var samples = [0, 1, 2]
    samples.map((i) => {
      samples.map((j) => {
        samples.map((k) => {
          if (!(i === j && j === k)) {
            result.push([i, j, k])
          }
        })
      })
    })
    var shuffled = window._.shuffle(result)
    var colors = []
    shuffled.map((it) => {
      colors.push(`rgb(${it[0] * 85 + 72}, ${it[1] * 85 + 72}, ${it[2] * 85 + 72})`)
    })
    return colors
  }
  this.noEmptyStrArray = function (arr) {
    var result = []
    arr.map((it) => {
      if (it.length > 0) {
        result.push(it)
      }
    })
    console.log(result)
    return result
  }
}).call(this)
