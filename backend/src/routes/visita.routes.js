const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const visitaController = require('../controllers/visitaController')
const validate = require('../middlewares/validate')
const { criarVisitaSchema, atualizarStatusVisitaSchema } = require('../validators/visita.validators')

router.post('/', auth, validate(criarVisitaSchema), visitaController.criarVisita)
router.get('/minhas', auth, visitaController.minhasVisitas)
router.patch('/:id/status', auth, validate(atualizarStatusVisitaSchema), visitaController.atualizarStatus)

module.exports = router