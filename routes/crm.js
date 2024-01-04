const express = require('express');
const router = express.Router();
const crmController = require('../controllers/crmController')
const {requireAuth} = require('../middlewares/authMiddleware')

router.get('/', requireAuth, crmController.listUser) // get list of users
router.get('/:id', requireAuth, crmController.listSelectedUser) // get only selected users
router.post('/', requireAuth, crmController.createUser) // create new user
router.put('/:id', requireAuth, crmController.updateUser) // update user
router.delete('/:id', requireAuth, crmController.deleteUser) // delete a user

module.exports = router;