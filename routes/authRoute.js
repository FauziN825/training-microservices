const express = require('express')
const router = express.Router();
const authControllers = require('../controllers/authController')
const userValidator = require ('../middleware/authMiddleware')


router.post('/login', authControllers.login)
router.post('/register',  userValidator.isFieldsEmpty, userValidator.isFieldsLength, userValidator.isFieldsLegalChars, authControllers.register)

module.exports = router;