const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const checkRole = require('../middlewares/checkRole')
const adminController = require('../controllers/adminController')

router.post('/convite', auth, checkRole('admin'), adminController.gerarConvite)
router.get('/convites', auth, checkRole('admin'), adminController.listarConvites)
router.post('/validar-codigo', adminController.validarCodigo)
router.get('/stats', auth, checkRole('admin'), adminController.getStats)

module.exports = router