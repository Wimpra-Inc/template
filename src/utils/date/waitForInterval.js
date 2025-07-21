/**
 * Verifica se a hora atual está dentro do intervalo especificado
 * @param {string} horaInicio - Hora de início no formato "HH:MM" (ex: "09:00")
 * @param {string} horaFim - Hora de fim no formato "HH:MM" (ex: "18:00")
 * @returns {boolean} - true se a hora atual está dentro do intervalo, false caso contrário
 */
function verificarHorarioExecucao (horaInicio, horaFim) {
  const agora = new Date()
  const horaAtual = agora.getHours()
  const minutoAtual = agora.getMinutes()

  // Converter horários de entrada para minutos desde meia-noite
  const [horaInicioH, minutoInicioM] = horaInicio.split(':').map(Number)
  const [horaFimH, minutoFimM] = horaFim.split(':').map(Number)

  const minutosInicio = horaInicioH * 60 + minutoInicioM
  const minutosFim = horaFimH * 60 + minutoFimM
  const minutosAtual = horaAtual * 60 + minutoAtual

  // Se o horário de fim é menor que o de início, significa que passa pela meia-noite
  if (minutosFim < minutosInicio) {
    return minutosAtual >= minutosInicio || minutosAtual <= minutosFim
  } else {
    return minutosAtual >= minutosInicio && minutosAtual <= minutosFim
  }
}

/**
 * Aguarda até que a hora atual esteja dentro do intervalo especificado
 * @param {string} horaInicio - Hora de início no formato "HH:MM"
 * @param {string} horaFim - Hora de fim no formato "HH:MM"
 * @param {number} intervaloVerificacao - Intervalo em milissegundos para verificar (padrão: 60000 = 1 minuto)
 * @returns {Promise<void>}
 */
module.exports = async function waitForInterval (
  horaInicio,
  horaFim,
  intervaloVerificacao = 60000
) {
  return new Promise((resolve) => {
    if (!horaInicio && !horaFim) {
      resolve()
    }
    const verificar = () => {
      if (verificarHorarioExecucao(horaInicio, horaFim)) {
        resolve()
      }
      setTimeout(verificar, intervaloVerificacao)
    }
    verificar()
  })
}
