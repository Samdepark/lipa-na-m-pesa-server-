const request = require ("request");
const axios = require('axios');
require ('dotenv/config')

 accessToken = (req, res, next)=> {
    try{

        const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
        const auth = new Buffer.from(`${process.env.SAFARICOM_CONSUMER_KEY}:${process.env.SAFARICOM_CONSUMER_SECRET}`).toString('base64');

        axios.get(url, {
                headers: {
                    "Authorization": "Basic " + auth
                }
            })
            .then(response=> {
                req.safaricom_access_token = response.data.access_token;
                next();
            })
            .catch(error =>{
                res.status(401).send({
                    'message': 'something went wrong while trying to process your payment',
                    "error":error.message
                })
            });
    }catch (error) {

        console.error("Access token error ", error)
        res.status(401).send({
            "message": 'Something went wrong when trying to process your payment',
            "error":error.message
        });
    };

};


module.exports = accessToken