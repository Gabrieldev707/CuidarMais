const express = require('express');
const router = express.Router();
const casaController = require('../controllers/casaController');
const auth = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');
const validate = require('../middlewares/validate');
const { criarCasaSchema, atualizarCasaSchema, atualizarVagasSchema } = require('../validators/casa.validators');

router.get('/', casaController.listarCasas);
router.get('/:id', casaController.buscarCasa);
router.post('/', auth, checkRole('gestor', 'admin'), validate(criarCasaSchema), casaController.criarCasa);
router.put('/:id', auth, checkRole('gestor', 'admin'), validate(atualizarCasaSchema), casaController.atualizarCasa);
router.delete('/:id', auth, checkRole('gestor', 'admin'), casaController.deletarCasa);
router.patch('/:id/vagas', auth, checkRole('gestor'), validate(atualizarVagasSchema), casaController.atualizarVagas);

module.exports = router;