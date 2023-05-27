class DownloadTimeoutError extends Error {
  constructor (error) {
    super(error)
    this.name = 'DownloadTimeoutError'
  }
}

module.exports = DownloadTimeoutError
