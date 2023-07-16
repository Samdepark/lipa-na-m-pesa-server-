const request = require("request");
require('dotenv').config();
const getTimestamp = require("../utils/utils.timestamp");
const ngrok = require('ngrok');
 const initiateSTKPush = async (req, res) => {
  try {
    const { amount, phone, Order_ID } = req.body;
    const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    const auth = "Bearer " + req.safaricom_access_token;
    const timestamp = getTimestamp();
    const password = Buffer.from(process.env.BUSINESS_SHORT_CODE + process.env.PASS_KEY + timestamp).toString('base64');
    const callback_url = await ngrok.connect(process.env.PORT);
    const api = ngrok.getApi();
    await api.listTunnels();
    console.log("callback ", callback_url);
     const options = {
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
    };
     const response = await request(options);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error while trying to create LipaNaMpesa details", error);
    res.status(503).send({
      message: "Something went wrong while trying to create LipaNaMpesa details. Contact admin",
      error: error
    });
  }
};
 module.exports = initiateSTKPush;