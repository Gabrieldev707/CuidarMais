const validarAmbiente = () => {
    const obrigatorias = ['MONGO_URI', 'JWT_SECRET']
    const ausentes = obrigatorias.filter(chave => !process.env[chave]?.trim())

    if (ausentes.length) {
        throw new Error(`Variaveis de ambiente ausentes: ${ausentes.join(', ')}`)
    }

    if (process.env.JWT_SECRET.trim().length < 32) {
        console.warn('Aviso: JWT_SECRET deve possuir pelo menos 32 caracteres')
    }

    if (!process.env.JWT_EXPIRES_IN) {
        process.env.JWT_EXPIRES_IN = '90d'
    }

    if (process.env.NODE_ENV === 'production' && !process.env.FRONTEND_URL?.trim()) {
        process.env.FRONTEND_URL = 'https://cuidarmais.vercel.app'
        console.warn('Aviso: FRONTEND_URL nao configurada; usando o frontend oficial')
    }

    const possuiEmailUser = Boolean(process.env.EMAIL_USER?.trim())
    const possuiEmailPass = Boolean(process.env.EMAIL_PASS?.trim())

    if (possuiEmailUser !== possuiEmailPass) {
        throw new Error('EMAIL_USER e EMAIL_PASS devem ser configuradas em conjunto')
    }
}

module.exports = { validarAmbiente }
