const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const visitaController = require('../controllers/visitaController')

router.post('/', auth, visitaController.criarVisita)
router.get('/minhas', auth, visitaController.minhasVisitas)
router.patch('/:id/status', auth, visitaController.atualizarStatus)

module.exports = router