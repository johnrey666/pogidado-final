const app = require('./backend/app');
const cors = require('cors');
app.use(cors());
const http = require("http");

const port = process.env.PORT || "3000";
app.set("port", port);

const server = http.createServer(app);
server.listen(port);