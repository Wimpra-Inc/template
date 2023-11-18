class BrowserConnectionError extends Error {
  constructor (error) {
    super(error)
    this.name = 'BrowserConnectionError'
    this.message = error
  }
}

module.exports = BrowserConnectionError
