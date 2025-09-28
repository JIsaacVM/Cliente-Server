const { Router } = require('express');
const { body, param } = require('express-validator');
const { register, registerWithStatus, login, list, update } = require('../controllers/userController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = Router();

const nameVal = body('nombre').optional().isString().isLength({ max: 120 });
const emailVal = body('correo').optional().isEmail().isLength({ max: 120 });
const userVal  = body('usuario').optional().isString().isLength({ max: 120 });
const passVal  = body('password').optional().isString().isLength({ min: 8 });

// Registro default (Activo)
router.post(
  '/register',
  [
    body('nombre').isString().isLength({ max: 120 }),
    body('correo').isEmail().isLength({ max: 120 }),
    body('usuario').isString().isLength({ max: 120 }),
    body('password').isString().isLength({ min: 8 }),
  ],
  register
);

// Registro con estatus elegido
router.post(
  '/register-with-status',
  [
    body('nombre').isString().isLength({ max: 120 }),
    body('correo').isEmail().isLength({ max: 120 }),
    body('usuario').isString().isLength({ max: 120 }),
    body('password').isString().isLength({ min: 8 }),
    body('estatus').isIn(['Activo', 'Inactivo']),
  ],
  registerWithStatus
);

// Login
router.post('/login', [body('usuario').notEmpty(), body('password').isLength({ min: 8 })], login);

// List (admin)
router.get('/', requireAuth, requireAdmin, list);

// Update (admin)
router.put(
  '/:id',
  [
    requireAuth,
    requireAdmin,
    param('id').isMongoId(),
    nameVal, emailVal, userVal, passVal,
    body('estatus').optional().isIn(['Activo', 'Inactivo']),
    body('rol').optional().isIn([1, 2]),
  ],
  update
);

module.exports = router;
