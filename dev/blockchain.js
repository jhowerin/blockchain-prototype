const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const uuid = require('uuid/v1');

// Constructor Function used to build out the blockchain blocks
// all blocks stored in the chain array
// all the new transactions created and before placed into a block
// are stored in the  array
function Blockchain() {
  this.chain = [];
  this.pendingTransactions = [];

  this.currentNodeUrl = currentNodeUrl;
  this.networkNodes = [];
  //Create the genesis block from the Constructor
  this.createNewBlock(100,'0','0');
}

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
  // newBlock will be the block that is inside the chain
  const newBlock = {
    //the block number,
    index: this.chain.length + 1,
    //the time
    timestamp: Date.now(),
    //the array of transactions - see the constructor
    transactions: this.pendingTransactions,
    // nonce used for the proof of work
    nonce: nonce,
    // hash of our data from the new block from the pendingTransactions
    hash: hash,
    // the previousBlockHash
    previousBlockHash: previousBlockHash
  };
  // we have to clear out the pendingTransactions array
  this.pendingTransactions = [];
  // push the new block onto the chain
  this.chain.push(newBlock);
  //return the createNewBlock
  return newBlock;
}

// get the last block in the chain - IE the most recent
Blockchain.prototype.getLastBlock = function(){
  return this.chain[this.chain.length - 1];
}

// create a new transaction and push onto pendingTransactions array
// in essence, we are pending the transaction to put onto the block until
// it gets validated.
Blockchain.prototype.createNewTransaction = function(amount, sender, recipient){
  const newTransaction = {
    amount: amount,
    sender: sender,
    recipient: recipient,
    transactionID: uuid().split('-').join('')
  };
  /*
  //now push this new transaction onto the pendingTransactions array
  this.pendingTransactions.push(newTransaction);
  // this will return the number of the block that the pendingTransaction will go on
  return this.getLastBlock()['index'] + 1;
  */
  return newTransaction;
}

Blockchain.prototype.addTransactionToPendingTransactions = function(transactionObj){
  this.pendingTransactions.push(transactionObj);
  return this.getLastBlock()['index'] + 1;
}

// this will hash a block of data into a fixed length string
// the return is the fixed length string
// using SHA 256 hashing function
Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce){
  const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
  const hash = sha256(dataAsString);
  return hash;
}

// Proof of Work - ensure block legitimacy
Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
  let nonce = 0;
  let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
  while(hash.substring(0,4) != '0000'){
    nonce++;
    hash = this.hashBlock(previousBlockHash,currentBlockData,nonce);
  }
  return nonce;
}

Blockchain.prototype.chainIsValid = function(blockchain){
  let validChain = true;

  for(var i = 1; i < blockchain.length; i++){
    const currentBlock = blockchain[i];
    const previousBlock = blockchain[i-1];
    const blockHash = this.hashBlock(previousBlock['hash'], {transactions: currentBlock['transactions'], index: currentBlock['index'] },currentBlock['nonce']);

    if(blockHash.substring(0,4) !== '0000') {
      //checking if the TX in the block ar valid
      validChain = false;
    }
    if(currentBlock['previousBlockHash'] !== previousBlock['hash']){
      //if we get here, the chain is not valid
      validChain = false;
    }
  };
  const genesisBlock = blockchain[0];
  //compare the genesisBlock with our initial definition / properties
  const correctNonce = genesisBlock['nonce'] === 100;
  const correctPreviousBlockHash = genesisBlock['previousBlockHash'] ==='0';
  const correctHash = genesisBlock['hash'] === '0';
  const correctTransactions = genesisBlock['transactions'].length === 0;
  if(!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions){
    validChain = false;
  }
  return validChain;
};

Blockchain.prototype.getBlock = function(blockhash) {
  let correctBlock = null;
  this.chain.forEach(block => {
    if(block.hash === blockhash) {
      correctBlock = block;
    }
  });
  return correctBlock;
}

Blockchain.prototype.getTransaction = function(transactionID) {
  let correctTransaction = null;
  let correctBlock = null;

  this.chain.forEach(block => {
    block.transactions.forEach(transaction => {
      if(transaction.transactionID === transactionID){
          correctTransaction = transaction;
          correctBlock = block;
      }
    });
  });
  return {
    transaction: correctTransaction,
    block: correctBlock
  }
};

Blockchain.prototype.getAddressData = function(address) {
  const addressTransactions = [];
  this.chain.forEach(block => {
    block.transactions.forEach(transaction => {
      if(transaction.sender === address || transaction.recipient ===address){
        addressTransactions.push(transaction);
      }
    });
  });
  let balance = 0;
  addressTransactions.forEach(transaction => {
    if(transaction.recipient === address) {
      balance += transaction.amount;
    }
    else if (transaction.sender === address){
      balance -= transaction.amount;
    }
  });
  return {
    addressTransactions: addressTransactions,
    addressBalance: balance
  }
};

// export the Blockchain constructor function to use in test.js
module.exports = Blockchain;
