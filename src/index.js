const express = require('express');
const app = express();
const db = require('./persistence');
const getItems = require('./routes/getItems');
const addItem = require('./routes/addItem');
const updateItem = require('./routes/updateItem');
const deleteItem = require('./routes/deleteItem');

app.use(express.json());
app.use(express.static(__dirname + '/static'));

app.get('/items', getItems);
app.post('/items', addItem);
app.put('/items/:id', updateItem);
app.delete('/items/:id', deleteItem);

const PORT = process.env.PORT || 8080;  // ✅ Cloud Run will set the PORT dynamically

db.init()
    .then(() => {
        app.listen(PORT, () => console.log(`✅ Server is running on port ${PORT}`));
    })
    .catch((err) => {
        console.error("❌ Database initialization failed:", err);
        process.exit(1);
    });

const gracefulShutdown = () => {
    console.log("⚠️ Shutting down server...");
    db.teardown()
        .catch((err) => console.error("❌ Error during shutdown:", err))
        .then(() => process.exit());
};

// ✅ Handle graceful shutdowns for Cloud Run & Nodemon
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown);  // Sent by nodemon
