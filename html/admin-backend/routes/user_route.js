const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');

// router.get('/users', userController.getUsers);
// router.post('/users', userController.createUser);
// router.get('/users/:id', userController.getUser);
// router.put('/users/:id', userController.updateUser);
// router.delete('/users/:id', userController.deleteUser);

router.get('/test', (req, res) => {
    res.send('hello from test api');
});

module.exports = router;