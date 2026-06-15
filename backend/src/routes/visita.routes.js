const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const checkRole = require('../middlewares/checkRole')
const visitaController = require('../controllers/visitaController')
const validate = require('../middlewares/validate')
const { criarVisitaSchema, atualizarStatusVisitaSchema } = require('../validators/visita.validators')

router.post('/', auth, checkRole('familia'), validate(criarVisitaSchema), visitaController.criarVisita)
router.get('/minhas', auth, visitaController.minhasVisitas)
router.patch('/:id/status', auth, checkRole('gestor'), validate(atualizarStatusVisitaSchema), visitaController.atualizarStatus)

module.exports = router
