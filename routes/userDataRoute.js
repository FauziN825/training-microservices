const express = require('express')
const router = express.Router();
const userController = require('../controllers/userDataController')
const userValidator = require('../middleware/authMiddleware')

router.post('/users/add',userValidator.authCheck, userController.createUserData)
router.get('/users/getAll',  userValidator.authCheck,userController.getAllUserData)
router.get('/users/:id',userValidator.authCheck, userController.getUserDataById)
router.patch('/users/:id', userValidator.authCheck, userController.updateUserData)
router.delete('/users/:id', userValidator.authCheck, userController.deleteUserDataById)
router.get('/users', userValidator.authCheck, userController.getUserData)
router.get('/users/account/:accountnumber' , userValidator.authCheck, userController.getUserDataByAccountNumber)
router.get('/users/identity/:identitynumber' , userValidator.authCheck, userController.getUserDataByIdentityNumber)
module.exports = router

