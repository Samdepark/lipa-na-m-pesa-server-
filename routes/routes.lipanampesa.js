const express = require ('express');
const router = express.Router()
const initiateSTKPush = require ('../controllers/controllers.lipanampesa');
const stkPushCallback = require ('../controllers/controllers.lipanampesa');
const confirmPayment = require ('../controllers/controllers.lipanampesa');


const accessToken = require ("../middlewares/middlewares.generateAccessToken.js");

router.route('/stkPush').post(accessToken,initiateSTKPush);
router.route('/stkPushCallback/:Order_ID').post(stkPushCallback);
router.route('/confirmPayment/:CheckoutRequestID').post(accessToken,confirmPayment);

module.exports = router;
