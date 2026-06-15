const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const checkRole = require('../middlewares/checkRole')
const candidaturaController = require('../controllers/candidaturaController')
const validate = require('../middlewares/validate')
const { enviarCandidaturaSchema, responderCandidaturaSchema } = require('../validators/candidatura.validators')

router.post('/', auth, checkRole('familia'), validate(enviarCandidaturaSchema), candidaturaController.enviarCandidatura)
router.get('/minhas', auth, checkRole('familia'), candidaturaController.minhasCandidaturas)
router.get('/gestor', auth, checkRole('gestor'), candidaturaController.candidaturasDoGestor)
router.patch('/:id/responder', auth, checkRole('gestor'), validate(responderCandidaturaSchema), candidaturaController.responderCandidatura)
router.get('/casa/:casaId', auth, checkRole('gestor'), candidaturaController.candidaturasDaCasa)

module.exports = router
