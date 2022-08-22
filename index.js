const express = require("express");
const app = express();

app.use(express.urlencoded());
app.use(express.json());

app.get('/',(req, res) => {
res.sendFile(__dirname + "/index.html");
});

app.post('/',(req, res) => {
var code = req.body.code;
console.log('Code = '+ code);
res.sendFile(__dirname + "/index.html");
});

const port = parseInt(process.env.PORT) || 8080;

app.listen(port, () => {
    console.log(`hello mcms: listening on port ${port}`);
});