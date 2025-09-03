import express from 'express';
import { router } from './routes/index.js';
import notFound from './middlewares/notFound.js';
import { globalErrorHandler } from './middlewares/globalErrorHandler.js';

const app = express();


app.use(express.json());

app.use("/api/v1", router);


app.get("/", (req, res) => {
    res.send("Student life toolkit server is running perfectly.")
})

app.use(globalErrorHandler)

app.use(notFound)


export default app