import mongoose from "mongoose";
import app from "./app.js";
import { env } from "./config/env.js";

let server;

const startServer = async () => {
    try {
        await mongoose.connect(env.DB_URL)
        console.log('mongoose is working perfectly');

        server = app.listen(env.PORT, () => {
            console.log('server is running');
        })

    } catch (error) {
        console.log(error);
    }
}


await startServer();


process.on("SIGTERM", (err) => {
    console.log('SIGTERM signal received. Server shutting down', err);

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    } else {
        process.exit(1);
    }
})
process.on("SIGINT", (err) => {
    console.log('SIGINT signal received. Server shutting down', err);

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    } else {
        process.exit(1);
    }
})
process.on("unhandledRejection", (err) => {
    console.log('An unhandled rejection detected. server shutting down..', err);

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    } else {
        process.exit(1);
    }
})


process.on("uncaughtException", (err) => {
    console.log('An uncaughtException rejection detected. server shutting down..', err);

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    } else {
        process.exit(1);
    }
})