import express from 'express';

const app = express();

app.get("/", (req, res) => {
    res.send("Student life toolkit server is running perfectly.")
})

export default app