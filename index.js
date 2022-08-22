const express = require("express");
const app = express();
const sheetdb = require('sheetdb-node');

// create a config file
var config = {
  address: '4d3gvcc2hgb6b',
  auth_login: 'qvkr416t',
  auth_password: '93o1xjmx3asfsj9kzvr6',
};

// Create new client
var client = sheetdb(config);

app.use(express.json());
app.use(express.urlencoded());

app.get('/',(req, res) => {
res.sendFile(__dirname + "/index.html");
});

app.post('/',(req, res) => {
var code = req.body.code;
console.log('Code = '+ code);

client.read({ 
    limit: 1,
    single_object: true,
    search: { Code: code } }).then(function(data) {
    console.log(data);
  }, function(err){
    console.log(err);
  });

res.sendFile(__dirname + "/index.html");
});

const port = parseInt(process.env.PORT) || 8080;

app.listen(port, () => {
    console.log(`hello mcms: listening on port ${port}`);
});