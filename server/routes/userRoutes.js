// routes/user.routes.js
const { Router } = require('express');
const { body, param } = require('express-validator');
const { register, login, list, update } = require('../controllers/userController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = Router();

// Validaciones base
const nameVal = body('nombre').optional().isString().isLength({ max: 120 });
const emailVal = body('correo')
  .optional()
  .isEmail()
  .withMessage('Correo inválido')
  .isLength({ max: 120 });
const userVal = body('usuario')
  .optional()
  .isString()
  .isLength({ max: 120 })
  .withMessage('El usuario no puede exceder 120 caracteres');
const passVal = body('password')
  .optional()
  .isString()
  .isLength({ min: 8 })
  .withMessage('La contraseña debe tener al menos 8 caracteres');

// Registro (rol=1 por defecto)
router.post(
  '/register',
  [
    body('nombre').isString().isLength({ max: 120 }),
    body('correo').isEmail().isLength({ max: 120 }),
    body('usuario').isString().isLength({ max: 120 }),
    body('password').isString().isLength({ min: 8 }),
    body('estatus').optional().isIn(['Activo', 'Inactivo'])
  ],
  register
);

// Login (puede usar usuario o correo)
router.post(
  '/login',
  [
    body('usuario').notEmpty().withMessage('Se requiere usuario o correo'),
    body('password').isLength({ min: 8 }).withMessage('Contraseña mínima de 8 caracteres')
  ],
  login
);

// Listado de usuarios (solo admin)
router.get('/', requireAuth, requireAdmin, list);

// Actualizar usuario (solo admin)
router.put(
  '/:id',
  [
    requireAuth,
    requireAdmin,
    param('id').isMongoId().withMessage('ID inválido'),
    nameVal,
    emailVal,
    userVal,
    passVal,
    body('estatus').optional().isIn(['Activo', 'Inactivo']),
    body('rol').optional().isIn([1, 2])
  ],
  update
);

module.exports = router;
