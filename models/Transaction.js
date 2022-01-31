const {utxos} = require("../db")

class Transaction {
    constructor(inputs, outputs) {
        this.inputs = inputs;
        this.outputs = outputs;
    }
    execute() {
        for (let i = 0; i < this.inputs.length; i++) {
            if (this.inputs[i].spent) {
                console.log( "some inputs in transaction are already spent" )
                return
            }
        }

        let totalInputs = this.inputs.reduce((p,c) => p + c.amount, 0)
        let totalOutputs = this.outputs.reduce((p, c) => p + c.amount, 0)
        
        if (totalInputs < totalOutputs) {
            console.log( "inputs don't cover outputs amount" )
            return
        }

        this.inputs.forEach((input) => {
            input.spent = true;
        })
        this.outputs.forEach((output) => {
            utxos.push(output)
        })
    }
}

module.exports = Transaction