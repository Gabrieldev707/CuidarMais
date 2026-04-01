const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const assistidoController = require('../controllers/assistidoController')
const validate = require('../middlewares/validate')
const { criarAssistidoSchema, atualizarAssistidoSchema } = require('../validators/assistido.validators')

router.post('/', auth, validate(criarAssistidoSchema), assistidoController.criarAssistido)
router.get('/meu', auth, assistidoController.meuAssistido)
router.patch('/meu', auth, validate(atualizarAssistidoSchema), assistidoController.atualizarAssistido)

module.exports = router