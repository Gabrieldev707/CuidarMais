const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const checkRole = require('../middlewares/checkRole')
const assistidoController = require('../controllers/assistidoController')
const validate = require('../middlewares/validate')
const { criarAssistidoSchema, atualizarAssistidoSchema } = require('../validators/assistido.validators')

router.post('/', auth, checkRole('familia'), validate(criarAssistidoSchema), assistidoController.criarAssistido)
router.get('/meu', auth, checkRole('familia'), assistidoController.meuAssistido)
router.patch('/meu', auth, checkRole('familia'), validate(atualizarAssistidoSchema), assistidoController.atualizarAssistido)

module.exports = router
