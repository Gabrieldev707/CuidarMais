export const getApiError = (err, fallback = 'Erro inesperado') => {
  const data = err.response?.data
  const details = data?.detalhes

  if (Array.isArray(details) && details.length > 0) {
    return details
      .map(item => item.campo ? `${item.campo}: ${item.mensagem}` : item.mensagem)
      .join('\n')
  }

  return data?.message || data?.erro || err.message || fallback
}
