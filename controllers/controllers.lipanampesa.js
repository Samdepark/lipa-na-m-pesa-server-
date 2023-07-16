const request = require("request");
require('dotenv').config();
const getTimestamp = require("../utils/utils.timestamp");
const ngrok = require('ngrok');
 // @desc initiate stk push
// @method POST
// @route /stkPush
// @access public
const initiateSTKPush = async (req, res) => {
  try {
    const { amount, phone, Order_ID } = req.body;
    const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    const auth = "Bearer " + req.safaricom_access_token;
     const timestamp = getTimestamp();
    //shortCode + passkey + timestamp
    const password = Buffer.from(process.env.BUSINESS_SHORT_CODE + process.env.PASS_KEY + timestamp).toString('base64');
    // create callback url
    const callback_url = await ngrok.connect(process.env.PORT);
    const api = ngrok.getApi();
    await api.listTunnels();
     console.log("callback ", callback_url);
    request(
      {
        url: url,
        method: "POST",
        headers: {
          "Authorization": auth
        },
        json: {
          "BusinessShortCode": process.env.BUSINESS_SHORT_CODE,
          "Password": password,
          "Timestamp": timestamp,
          "TransactionType": "CustomerPayBillOnline",
          "Amount": amount,
          "PartyA": phone,
          "PartyB": process.env.BUSINESS_SHORT_CODE,
          "PhoneNumber": phone,
          "CallBackURL": `${callback_url}/api/stkPushCallback/${Order_ID}`,
          "AccountReference": "Wamaitha Online Shop",
          "TransactionDesc": "Paid online"
        }
      },
      function (error, response, body) {
        if (error) {
          console.error(error);
          res.status(503).send({
            message: "Error with the stk push",
            error: error
          });
        } else {
          res.status(200).json(body);
        }
      }
    );
  } catch (error) {
    console.error("Error while trying to create LipaNaMpesa details", error);
    res.status(503).send({
      message: "Something went wrong while trying to create LipaNaMpesa details. Contact admin",
      error: error
    });
  }
};
 module.exports = initiateSTKPush;