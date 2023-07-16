const express = require ("express");
const app = express();
const cors = require ("cors");
require ('dotenv/config');
const lipaNaMpesaRoute = require ("./routes/routes.lipanampesa");
const port = process.env.PORT


// middlewares
app.use(express.json())//converts files into json
app.use(cors())

// import routes
app.use('/api',lipaNaMpesaRoute);




app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});
