const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const candidaturaController = require('../controllers/candidaturaController')

router.post('/', auth, candidaturaController.enviarCandidatura)
router.get('/minhas', auth, candidaturaController.minhasCandidaturas)
router.patch('/:id/responder', auth, candidaturaController.responderCandidatura)
router.get('/casa/:casaId', auth, candidaturaController.candidaturasDaCasa)

module.exports = router