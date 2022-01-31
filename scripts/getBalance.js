const client = require("./client")
const {argv} = require("yargs")
const {address} = argv


// invoke "add"
client.request('getBalance', [address], function(err, response) {
    if(err) throw err;
    console.log(response.result); // 2
  });