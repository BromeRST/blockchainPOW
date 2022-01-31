const {utxos} = require("../db")

class CoinbaseTransaction {
    constructor(inputs, outputs) {
        this.inputs = inputs;
        this.outputs = outputs;
    }
    execute() {
        this.inputs.forEach((input) => {
            input.spent = true;
        })
        this.outputs.forEach((output) => {
            utxos.push(output)
        })
    }
}

module.exports = CoinbaseTransaction