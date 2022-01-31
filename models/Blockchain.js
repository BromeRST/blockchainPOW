const Block = require("./Block");

class Blockchain {
    constructor() {
        this.chain = [new Block()]
    }
    addBlock(block) {
            block.previousHash = this.chain[this.chain.length-1].toHash()
            this.chain.push(block);
    }
    isValid() {
        let boolean = false
        for (let i = this.chain.length - 1; i > 0; i --) {
            if (this.chain[i].previousHash === this.chain[i-1].toHash()) {
                boolean = true
            }
            else boolean = false
        }
        return boolean
    }
}

module.exports = Blockchain;