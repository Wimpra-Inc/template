function setProgress () {
    global.PROGRESS = ((global.PROCESSED_ITENS) * 100) / global.TOTAL_ITENS
  }

  function incrementsAttemps (attempts) {
    global.ATTEMPTS += attempts
  }

  function clearAttemps () {
    global.ATTEMPTS = 0
  }
  function setTotalItens (total) {
    global.TOTAL_ITENS = total
  }
  function setProcessedItens (processed) {
    global.PROCESSED_ITENS = processed
    setProgress()
  }

  function getProgress () {
    return global.PROGRESS
  }

  module.exports = {
    setProgress,
    incrementsAttemps,
    setTotalItens,
    setProcessedItens,
    getProgress,
    clearAttemps
  }
