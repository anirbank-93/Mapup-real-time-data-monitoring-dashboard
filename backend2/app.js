const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const dbConfig = require("./app/config/db.config");

require("dotenv").config();

const app = express();

var corsOptions = {
    origin: "http://localhost:3000"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "user"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'user' to roles collection");
            });
        }
    });
}

db.mongoose
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connect to MongoDB.");
        initial();
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Hello." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
    },
})

let timeChange;

const data = [
    { name: 1, x: Math.random() * 10, y: Math.random() * 10 },
    { name: 2, x: Math.random() * 10, y: Math.random() * 10 },
    { name: 3, x: Math.random() * 10, y: Math.random() * 10 },
    { name: 4, x: Math.random() * 10, y: Math.random() * 10 },
    { name: 5, x: Math.random() * 10, y: Math.random() * 10 },
    { name: 6, x: Math.random() * 10, y: Math.random() * 10 },
];

io.on('connection', (socket) => {
    console.log('a new client connected');
    if (timeChange) clearInterval(timeChange);

    if (data.length > 5) {
        data.reverse().pop();
        data.reverse()
    }
    data.push({ name: data[data.length - 1].name + 1, x: Math.random() * 10, y: Math.random() * 10 })
    setInterval(() => socket.emit('message', data), 1000)

    socket.on('disconnect', () => {
        console.log(`socket ${socket.id} disconnected`);
    })
});

module.exports = {
    io,
}