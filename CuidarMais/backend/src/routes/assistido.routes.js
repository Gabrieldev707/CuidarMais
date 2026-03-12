const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const assistidoController = require('../controllers/assistidoController')

router.post('/', auth, assistidoController.criarAssistido)
router.get('/meu', auth, assistidoController.meuAssistido)
router.patch('/meu', auth, assistidoController.atualizarAssistido)

module.exports = router