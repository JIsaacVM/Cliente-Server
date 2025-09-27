const { Router } = require('express');
const { body, param } = require('express-validator');
const { register, login, list, update } = require('../controllers/userController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = Router();

// Validaciones
const nameVal = body('nombre').optional().isString().isLength({ max: 120 });
const emailVal = body('correo').optional().isEmail().isLength({ max: 120 });
const userVal = body('usuario').optional().isString().isLength({ max: 120 });
const passVal = body('password').optional().isString().isLength({ min: 8 });

// Registro (rol=1 por defecto)
router.post(
  '/register',
  [
    body('nombre').isString().isLength({ max: 120 }),
    body('correo').isEmail().isLength({ max: 120 }),
    body('usuario').isString().isLength({ max: 120 }),
    body('password').isString().withMessage('password debe ser una cadena').isLength({ min: 8 }).withMessage('password debe tener al menos 8 caracteres')
  ],
  register
);

// Login por usuario o correo
router.post('/login', [body('usuario').notEmpty(), body('password').isLength({ min: 8 })], login);

// Listado solo admin
router.get('/', requireAuth, requireAdmin, list);

// Actualizar (admin)
router.put(
  '/:id',
  [
    requireAuth,
    requireAdmin,
    param('id').isMongoId(),
    nameVal,
    emailVal,
    userVal,
    passVal,
    body('estatus').optional().isIn(['Activo', 'Inactivo']),
    body('rol').optional().isIn([1, 2])
  ],
  update
);

router.post(
  '/register-with-status',
  [
    body('nombre').isString().isLength({ max: 120 }),
    body('correo').isEmail().isLength({ max: 120 }),
    body('usuario').isString().isLength({ max: 120 }),
    body('password').isString().isLength({ min: 8 }),
    body('estatus').isIn(['Activo', 'Inactivo']) // validación de estatus
  ],
  registerWithStatus
);

module.exports = router;
