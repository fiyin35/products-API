require('dotenv').config();
require('express-async-errors');

const express = require('express');

const app = express();

const connectDB = require('./db/connect')

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler')
const productRouter = require('./routes/products')

//middleware
app.use(express.json())

//routes
app.get('/', (req, res) => {
    res.send('<h1> Store API</h1> <a href="api/v1/products"> product routes</a>')
})
app.use('/api/v1/products', productRouter)

//product routes
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const PORT = process.env.PORT || 4000

const start = async () => {
    try {
        //connect db
        await connectDB(process.env.MONGO_URI)
        app.listen(PORT, () => console.log(`server is listening on Port: ${PORT}...`))
    } catch(error) {
        console.log(error)
    }
}

start()
