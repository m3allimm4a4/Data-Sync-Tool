const express = require('express');

const { addToppings, deleteAllToppings } = require('../controllers/toppingsController');

const router = express.Router();

router.route('/').post(addToppings).delete(deleteAllToppings);

module.exports = router;
