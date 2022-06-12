const express = require('express');

const { createOrders, deleteAllOrders } = require('../controllers/ordersController');

const router = express.Router();

router.route('/').post(createOrders).delete(deleteAllOrders);

module.exports = router;
