const express = require('express');
const app = express();
const db = require('./persistence');
const getItems = require('./routes/getItems');
const addItem = require('./routes/addItem');
const updateItem = require('./routes/updateItem');
const deleteItem = require('./routes/deleteItem');

app.use(express.json());
app.use(express.static(__dirname + '/static'));

// ✅ Health Check Route (Cloud Run Health Probes)
app.get('/health', (req, res) => {
    res.status(200).json({ status: "🟢 Service is up and running!" });
});

// ✅ CRUD Endpoints
app.get('/items', getItems);
app.post('/items', addItem);
app.put('/items/:id', updateItem);
app.delete('/items/:id', deleteItem);

const PORT = process.env.PORT || 8080;  // ✅ Cloud Run dynamically assigns PORT

db.init()
    .then(() => {
        console.log("✅ Database connected successfully.");
        app.listen(PORT, () => console.log(`✅ Server is running on port ${PORT}`));
    })
    .catch((err) => {
        console.error("❌ Database connection failed:", err.message);
        console.error("⚠️ Ensure database is available before starting the app.");
        process.exit(1);
    });

const gracefulShutdown = () => {
    console.log("⚠️ Shutting down server...");
    db.teardown()
        .catch((err) => console.error("❌ Error during shutdown:", err))
        .then(() => process.exit());
};

// ✅ Handle Graceful Shutdown (Cloud Run & Nodemon)
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown);  // Sent by nodemon

// ✅ Handle Unexpected Errors
process.on('uncaughtException', (err) => {
    console.error("❌ Uncaught Exception:", err);
    gracefulShutdown();
});

process.on('unhandledRejection', (reason, promise) => {
    console.error("⚠️ Unhandled Rejection at:", promise, "reason:", reason);
});
