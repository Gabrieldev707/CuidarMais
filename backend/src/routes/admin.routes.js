const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const checkRole = require('../middlewares/checkRole')
const adminController = require('../controllers/adminController')
const blockDemoAdmin = require('../middlewares/blockDemoAdmin')
const validate = require('../middlewares/validate')
const { gerarConviteSchema, validarCodigoSchema } = require('../validators/admin.validators')

router.post('/convite', auth, checkRole('admin'), blockDemoAdmin, validate(gerarConviteSchema), adminController.gerarConvite)
router.get('/convites', auth, checkRole('admin'), adminController.listarConvites)
router.delete('/convite/:id', auth, checkRole('admin'), blockDemoAdmin, adminController.deletarConvite)
router.post('/validar-codigo', validate(validarCodigoSchema), adminController.validarCodigo)
router.get('/stats', auth, checkRole('admin'), adminController.getStats)

module.exports = router
