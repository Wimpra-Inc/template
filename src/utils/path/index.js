const { rmSync, existsSync, mkdirSync } = require('fs');

module.exports = {
  createDirectory: function (path, removeIfExists = false) {
    if (removeIfExists) {
        if (existsSync(path)) {
          rmSync(path, { recursive: true })
        }
      }

      if (!existsSync(path)) {
        mkdirSync(path)
      }
  }
}
