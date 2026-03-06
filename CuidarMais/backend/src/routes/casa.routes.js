const express = require('express');
const router = express.Router();
const casaController = require('../controllers/casaController');
const auth = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');

router.get('/', casaController.listarCasas);
router.get('/:id', casaController.buscarCasa);
router.post('/', auth, checkRole('gestor', 'admin'), casaController.criarCasa);
router.put('/:id', auth, checkRole('gestor', 'admin'), casaController.atualizarCasa);
router.delete('/:id', auth, checkRole('gestor', 'admin'), casaController.deletarCasa);
router.patch('/:id/vagas', auth, checkRole('gestor'), casaController.atualizarVagas);

module.exports = router;