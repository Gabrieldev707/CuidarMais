const User = require('../models/User')
const { DEMO_EMAILS } = require('../config/demo')

module.exports = async(req, res, next) => {
    try {
        const usuario = await User.findById(req.usuario.id).select('email')

        if (usuario?.email === DEMO_EMAILS.admin) {
            return res.status(403).json({
                message: 'A conta admin de demonstracao possui acesso somente leitura'
            })
        }

        next()
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao validar permissoes da conta',
            error: error.message
        })
    }
}
