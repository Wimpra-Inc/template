/**
 * Retorna um array de strings com os meses no intervalo especificado
 * @param {string} anoMesInicial - Ano e mês inicial no formato "YYYY-MM"
 * @param {string} anoMesFinal - Ano e mês final no formato "YYYY-MM"
 * @returns {string[]} - Array de strings com os meses no intervalo
 */
module.exports = (anoMesInicial, anoMesFinal) => {
  const resultado = []

  let [anoInicio, mesInicio] = anoMesInicial.split('-').map(Number)
  let [anoFim, mesFim] = anoMesFinal.split('-').map(Number)

  // Ajusta para índice de mês (0–11)
  mesInicio -= 1
  mesFim -= 1

  let ano = anoInicio
  let mes = mesInicio

  while (ano < anoFim || (ano === anoFim && mes <= mesFim)) {
    const mesFormatado = String(mes + 1).padStart(2, '0')
    resultado.push({ ano, mes: mesFormatado })

    mes++
    if (mes > 11) {
      mes = 0
      ano++
    }
  }

  return resultado
}
