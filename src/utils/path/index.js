const { existsSync, mkdirSync } = require('fs')

module.exports = {
  createDirectory: function (...path) {
    path.forEach((path) => {
      if (!existsSync(path)) {
        mkdirSync(path)
      }
    })
  }
}
