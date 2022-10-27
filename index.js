const express = require("express");
const app = express();
const sheetdb = require('sheetdb-node');

// create a config file
var config = {
    address: 'cndi8g805p745',
    auth_login: '8sv6bsyz',
    auth_password: 'c6lr1fidvc545mlkedll',
};

const port = parseInt(process.env.PORT) || 8080;

// Create new client
var client = sheetdb(config);

app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => {
    res.send(writeHTML(null));
    console.log("finished GET response");
});

let row;

app.post('/', async (req, res) => {
    var code = req.body.code;
    console.log('Code = ' + code);
    
    await client.read({
        limit: 1,
        sheet: 'MMCodeList',
        single_object: true,
        search: { Code: code }
    }).then(function (data) {
        console.log(data);
        try {
            row = JSON.parse(data);
        } catch(e) {
            console.log(e);
            return null;
        }   
    }, function (err) {
        console.log(err);
    });
    
    await client.update(
        'Code', // column name
        code, // value to search for
        { 'Scanned': 'Yes' }, // object with updates
        'MMCodeList'
    ).then(function (data) {
        console.log(data);
    }, function (err) {
        console.log(err);
    });


    res.send(writeHTML(row));
    console.log("finished POST response");
});

const head = '<html><head><title>MCMS PTO Kona Ice Reward</title></head><body style="background-color: black; color: white; ">';
const wrapper = '<div style="display: flex; flex-direction: column; width: 100vw; height: 100vh; align-items: center; justify-content: center;">'
const submit = '<form action="/" method="POST">Code: <input id="code" type="text" name="code"></form></div>'
const script = '<script>document.getElementById("code").focus();</script>';
const foot = '</body></html>';

function writeHTML(data) {
    console.log('In writeHTML.');
    return head + wrapper + getMessage(data) + submit + script + foot;
}

function getMessage(data) {
    console.log('In getMessage.');
    console.log(data);
    let color = 'grey';
    let messageHTML = '<h1>No Current Scan</h1>';
    if (null === data){
        console.log("null")
    }
    else if (data[0].Scanned == "No"){
        console.log(data[0].Scanned);
        color = getBandColor(data);        
        messageHTML = getPersonalizedMessage("Good Scan", data);
    }
    else {
        console.log(data[0].Scanned);
        color = getBandColor(data);  
        messageHTML = getPersonalizedMessage("Already Scanned", data);
    }
    return '<div id="result" style="border-radius: 15px; height: 45%; width: 50%; color black; display: flex; flex-direction: column; align-items: center; justify-content: center;background-color: ' + color + '; padding: 20px 20px 20px 20px; margin-bottom: 20px;">' + messageHTML + '</div>';
}

function getPersonalizedMessage(message, data) {
    return `<h1>${message}</h1><h1>${data[0].Name}</h1><h1>${data[0].QRCodeType}</h1>`;
}

function getBandColor(data) {
    if (data[0].Scanned == 'Yes') { return 'purple';} // already scanned
    if (data[0].Option == 'Cheese') {return 'orange'} 
    if (data[0].Option == 'Pepperoni') {return 'red'}
    return 'grey';
}

app.listen(port, () => {
    console.log(`hello mcms: listening on port ${port}`);
});

