const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid/v1');
const port = process.argv[2];
const rp = require('request-promise');

const nodeAddress = uuid().split('-').join('')

const bitcoin = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));


app.get('/', (req, res) => {
  //res.send('I am root')
  res.sendFile('./block-explorer/index.html', { root: __dirname});
})

app.get('/blockchain', (req, res) => {
  res.send(bitcoin)
  console.log("Getting the blockchain");
})

app.post('/transaction', (req, res) => {
  /*
  console.log("Posting to blockchain");
  const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
  res.json({note: `Transaction will be added in block ${blockIndex}`});
  */
  const newTransaction = req.body;
  const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);
  res.json({note: `Transaction will be added in block ${blockIndex}`});
})

//create a new transaction and then brodcast it to all other nodes
app.post('/transaction/broadcast', (req, res) => {
  console.log("Creating new transaction and broadcasting to all nodes");
  const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
  bitcoin.addTransactionToPendingTransactions(newTransaction);

  //create an array of promises
  const requestPromises = [];

  //broadcast to all other nodes
  bitcoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/transaction',
      method: 'POST',
      body: newTransaction,
      json: true
    };
    requestPromises.push(rp(requestOptions));
  });
  Promise.all(requestPromises)
  .then(data => {
      res.json({ note: 'Transaction created and broadcast successfully'});
  });
});

// performing a proof of work to create a new transaction/block
app.get('/mine', (req, res) => {
  console.log('Mining the block!')
  const lastBlock = bitcoin.getLastBlock();
  const previousBlockHash = lastBlock['hash'];
  const currentBlockData = {
    transactions: bitcoin.pendingTransactions,
    index: lastBlock['index'] + 1
  }
  const nonce = bitcoin.proofOfWork(previousBlockHash,currentBlockData);
  const blockhash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
  const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockhash);
  const requestPromises = [];

  bitcoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions= {
      uri: networkNodeUrl + '/receive-new-block',
      method: 'POST',
      body: { newBlock: newBlock },
      json: true
    };
    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises)
  .then(data => {
    const requestOptions = {
      uri: bitcoin.currentNodeUrl + '/transaction/broadcast',
      method: 'POST',
      body: {
        amount: 12.5,
        sender: "00",
        recipient: nodeAddress
      },
      json: true
    };
    return rp(requestOptions);
  })
  .then(data => {
    res.json({
      note: "New Block mined and broadcast successfully",
      block: newBlock
    });
  });
});

app.post('/receive-new-block', (req, res) => {
  const newBlock = req.body.newBlock;
  const lastBlock = bitcoin.getLastBlock();
  const correctHash = lastBlock.hash === newBlock.previousBlockHash;
  const correctIndex = lastBlock['index'] + 1 === newBlock['index'];
  if(correctHash && correctIndex){
    bitcoin.chain.push(newBlock);
    bitcoin.pendingTransactions = [];
    res.json({
      note: 'New block received and accepted',
      newBlock: newBlock
    });
  } else {
    res.json({
      note: 'New block rejected',
      newBlock: newBlock
    });
  }
});

// register a node and broadcast the node to the network
app.post('/register-and-broadcast-node', (req,res) => {
  const newNodeUrl = req.body.newNodeUrl;
  if(bitcoin.networkNodes.indexOf(newNodeUrl) == -1)
    bitcoin.networkNodes.push(newNodeUrl);
  // broadcast the new node
  const regNodesPromises = [];
  bitcoin.networkNodes.forEach(networkNodeUrl => {
    // call register node endpoint
    const requestOptions = {
      uri: networkNodeUrl + '/register-node',
      method: 'POST',
      body: { newNodeUrl: newNodeUrl },
      json: true
    };
    regNodesPromises.push(rp(requestOptions));
  });
  Promise.all(regNodesPromises).then(data => {
    //use the data
    const bulkRegisterOptions = {
      uri: newNodeUrl + '/register-nodes-bulk',
      method: 'POST',
      body: { allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl ] },
      json: true
    };
    return rp(bulkRegisterOptions);
  })
  .then(data => {
    res.json({note: 'New node registered with newtork successfully'});
  })
});

// register a node with the network
app.post('/register-node', (req,res)=> {
  const newNodeUrl = req.body.newNodeUrl;
  const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
  const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
  if(nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(newNodeUrl);
  res.json({ note: 'New node registered successfuly.'});
});

app.post('/register-nodes-bulk', (req,res) => {
  const allNetworkNodes = req.body.allNetworkNodes;
  allNetworkNodes.forEach(networkNodeUrl => {
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
    const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(networkNodeUrl);
  });
  res.json( { note: "Bulk registration successful!" } );
});

app.get('/consensus', (req, res) => {
  const requestPromises = [];
  bitcoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/blockchain',
      method: 'GET',
      json: true
    };
    requestPromises.push(rp(requestOptions));
  });
  Promise.all(requestPromises)
  .then(blockchains => {
    const currentChainLength = bitcoin.chain.length;
    let maxChainLength = currentChainLength;
    let newLongestChain = null;
    let newPendingTransactions = null;

    blockchains.forEach(blockchain => {
      if(blockchain.chain.length > maxChainLength){
        maxChainLength = blockchain.chain.length;
        newLongestChain = blockchain.chain;
        newPendingTransactions = blockchain.pendingTransactions;
      }
    });

  if(!newLongestChain || (newLongestChain && !bitcoin.chainIsValid(newLongestChain))){
    res.json({
      note: 'Current chain has not been replaced.',
      chain: bitcoin.chain
    });
  } else  {
    bitcoin.chain = newLongestChain;
    bitcoin.pendingTransactions = newPendingTransactions;
    res.json({
      note: 'This chain has been replaced',
      chain: bitcoin.chain
    })
  }
  });
});

app.get('/block/:blockHash', (req,res) => {
  const blockHash = req.params.blockHash;
  const correctBlock = bitcoin.getBlock(blockHash);
  res.json({
    block: correctBlock
  });
});

app.get('/transaction/:transactionID', (req,res) => {
  const transactionID = req.params.transactionID;
  const transactionData = bitcoin.getTransaction(transactionID);
  res.json({
    transaction: transactionData.transaction,
    block: transactionData.block
  })
});

app.get('/address/:address', (req, res) => {
  const address = req.params.address;
  const addressData = bitcoin.getAddressData(address);
  res.json({
    addressData: addressData,
  });
});

app.get('/block-explorer', (req,res) => {
  res.sendFile('./block-explorer/index.html', { root: __dirname});
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`)
})
