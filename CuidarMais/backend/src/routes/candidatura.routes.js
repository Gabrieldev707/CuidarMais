const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const candidaturaController = require('../controllers/candidaturaController')
const validate = require('../middlewares/validate')
const { enviarCandidaturaSchema, responderCandidaturaSchema } = require('../validators/candidatura.validators')

router.post('/', auth, validate(enviarCandidaturaSchema), candidaturaController.enviarCandidatura)
router.get('/minhas', auth, candidaturaController.minhasCandidaturas)
router.patch('/:id/responder', auth, validate(responderCandidaturaSchema), candidaturaController.responderCandidatura)
router.get('/casa/:casaId', auth, candidaturaController.candidaturasDaCasa)

module.exports = router