require('dotenv').config();
require('express-async-errors')
const express = require('express')
const app = express()
const connectDB = require('./db/connect')
const jobController = require('./controllers/jobController');
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleWare = require("./middleware/error-handler");
const multer = require('multer');
const userRouter = require('./routes/userRouter')
const jobRouter = require('./routes/jobRouter')
const authRouter = require('./routes/authRouter')
const cors = require('cors')
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

app.use(express.json());
app.use(cors({
    origin: '*'
}))
//routes

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter)
app.use('/api/v1/job', jobRouter(upload))

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleWare);

const port = process.env.PORT || 4000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        app.listen(port, () => console.log(`server is listening to port ${port}`))
    } catch (error) {
        console.log(error);
    }
}
start();