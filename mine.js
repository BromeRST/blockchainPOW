const Block = require("./models/Block");
const CoinbaseTransaction = require("./models/CoinbaseTransaction")
const UTXO = require("./models/UTXO")
const db = require("./db")
const {PUBLIC_KEY} = require("./configure")
let initialValue = "0x0"
let initialValueRepeat = 63
let TARGET_DIFFICULTY = BigInt(initialValue + "F".repeat(initialValueRepeat))
const BLOCK_REWARD = 10


let mining = false;

function startMining() {
    mining = true;
    mine()
}

function stopMining() {
    mining = false
}

function difficultyAdjust() {
    let totalNonce = 0
    
    for (let i = db.blockchain.chain.length - 10; i < db.blockchain.chain.length; i++) {
        totalNonce += db.blockchain.chain[i].nonce
    }

    if (totalNonce/10 < 10000) {
        initialValue += "0"
        initialValueRepeat -= 1
        TARGET_DIFFICULTY = BigInt(initialValue + "F".repeat(initialValueRepeat))
    }

    if (totalNonce/10 > 30000) {                                                    
        if(initialValue !== "0x0") {
            initialValue = initialValue.substring(0, initialValue.length - 1)
            console.log(initialValue)
        }
        if(initialValueRepeat !== 63) {
            initialValueRepeat += 1
            console.log(initialValueRepeat)                                      
        }

        TARGET_DIFFICULTY = BigInt(initialValue + "F".repeat(initialValueRepeat))
    }

    console.log("difficulty", TARGET_DIFFICULTY)
}

function mine() {
    if (!mining) return

    const block = new Block()
    const blockHash = "0x" + block.toHash()

    const coinbaseUTXO = new UTXO(PUBLIC_KEY, BLOCK_REWARD)
    const coinbaseTX = new CoinbaseTransaction([], [coinbaseUTXO])
    block.addTransaction(coinbaseTX)

    while(BigInt("0x" + block.toHash()) >= TARGET_DIFFICULTY) {
        block.nonce++
    }

    block.execute()

    db.blockchain.addBlock(block);

    if(db.blockchain.chain.length % 10 === 0) {
        difficultyAdjust()
    }


    if(db.blockchain.isValid() === true) {
        console.log(`Mined block n #${db.blockchain.chain.length} with a hash of ${blockHash} a nonce ${block.nonce}`)
        setTimeout(mine, 2000)
    } else {
        console.log("this block is not valid")
    }
}

mine()

module.exports = {
    startMining,
    stopMining
}