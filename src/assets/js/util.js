(function () {
  this.strLimit = function (args) {
    var str = args[0]
    var limit = args[1]
    var result = str.length <= limit ? str : str.substring(0, limit - 1) + '...'
    return result
  }
}).call(this)
