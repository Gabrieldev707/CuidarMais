const User = require('../models/User')
const { READ_ONLY_ADMIN_EMAILS } = require('../config/demo')

module.exports = async(req, res, next) => {
    try {
        const usuario = await User.findById(req.usuario.id).select('email')

        if (READ_ONLY_ADMIN_EMAILS.includes(usuario?.email)) {
            return res.status(403).json({
                message: 'A conta admin publica possui acesso somente leitura'
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
