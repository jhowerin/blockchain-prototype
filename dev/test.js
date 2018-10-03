//testing
// import blockchain data structure
const Blockchain = require('./blockchain');

//make an instance of the blockchain
const bitcoin = new Blockchain();

// testing the createNewBlock method
bitcoin.createNewBlock(2389,'preHash', 'hash2389');

// testing the createNewTransaction metho
bitcoin.createNewTransaction(100,"ALEX", "JENNA");

// adding another new Block and this will mine the "Alex" pendingTransaction
bitcoin.createNewBlock(2390,'hash2389', 'hash2390');

// testing hashing of a block of data
const previousBlockHash = '';
const currentBlockData = [
  {
    amount: 10,
    send: "TheSENDER10",
    recipient: "TheRECIPIENT10"
  },
  {
    amount: 20,
    send: "TheSENDER20",
    recipient: "TheRECIPIENT201"
  },
  {
    amount: 30,
    send: "TheSENDER30",
    recipient: "TheRECIPIENT30"
  }
];
const nonce = 100;
const testBlockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
// end testing hashing of a block of data

// testing proof of Work
const testProofOfWork = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
console.log(testProofOfWork);
const verifyNonce = bitcoin.hashBlock(previousBlockHash,currentBlockData,testProofOfWork);
console.log(verifyNonce);
// end testing proof of work

console.log(bitcoin);
console.log(testBlockHash);

const bc1 = {
"chain": [
{
"index": 1,
"timestamp": 1538149606384,
"transactions": [],
"nonce": 100,
"hash": "0",
"previousBlockHash": "0"
},
{
"index": 2,
"timestamp": 1538150021659,
"transactions": [
{
"amount": 3004,
"sender": "Sender3004",
"recipient": "from3004",
"transactionID": "927e2130c33611e882d997e72a0a3dec"
}
],
"nonce": 11884,
"hash": "0000457c7fcd3f86d4b4af16807f5bbe07c2a2288e88aec441bf71ffef01850d",
"previousBlockHash": "0"
},
{
"index": 3,
"timestamp": 1538150046105,
"transactions": [
{
"amount": 12.5,
"sender": "00",
"recipient": "b480c0e0c33511e882d997e72a0a3dec",
"transactionID": "ac0af650c33611e882d997e72a0a3dec"
}
],
"nonce": 57786,
"hash": "0000a841db5f0d1e86e5281ad4ccba3d6d1ef4e31748e15319219e6d659f702",
"previousBlockHash": "0000457c7fcd3f86d4b4af16807f5bbe07c2a2288e88aec441bf71ffef01850d"
},
{
"index": 4,
"timestamp": 1538150058300,
"transactions": [
{
"amount": 12.5,
"sender": "00",
"recipient": "b480c0e0c33511e882d997e72a0a3dec",
"transactionID": "ba9a6110c33611e882d997e72a0a3dec"
}
],
"nonce": 43011,
"hash": "00007644f2ba12f85ea540759101b5c442dc5a28d19b8a3c4601de1544effdfe",
"previousBlockHash": "0000a841db5f0d1e86e5281ad4ccba3d6d1ef4e31748e15319219e6d659f702d"
},
{
"index": 5,
"timestamp": 1538150292590,
"transactions": [
{
"amount": 12.5,
"sender": "00",
"recipient": "b480c0e0c33511e882d997e72a0a3dec",
"transactionID": "c1df0930c33611e882d997e72a0a3dec"
}
],
"nonce": 10303,
"hash": "00008602cec4c966ee51d15eb0e33bb6d906b51f75ec36737871c0f1dfc28210",
"previousBlockHash": "00007644f2ba12f85ea540759101b5c442dc5a28d19b8a3c4601de1544effdfe"
},
{
"index": 6,
"timestamp": 1538150336155,
"transactions": [
{
"amount": 12.5,
"sender": "00",
"recipient": "b480c0e0c33511e882d997e72a0a3dec",
"transactionID": "4d86af10c33711e882d997e72a0a3dec"
}
],
"nonce": 8935,
"hash": "0000d19fcebc76e30d4e39433ea470152a6598316ccb44bc4a1f763a49d6fd02",
"previousBlockHash": "00008602cec4c966ee51d15eb0e33bb6d906b51f75ec36737871c0f1dfc28210"
},
{
"index": 7,
"timestamp": 1538150362152,
"transactions": [
{
"amount": 12.5,
"sender": "00",
"recipient": "b480c0e0c33511e882d997e72a0a3dec",
"transactionID": "677db7b0c33711e882d997e72a0a3dec"
}
],
"nonce": 10226,
"hash": "000034d29d4eba96e71f04995b2ceb79e4138c83d3eae3b570419f0f2eb45ec5",
"previousBlockHash": "0000d19fcebc76e30d4e39433ea470152a6598316ccb44bc4a1f763a49d6fd02"
},
{
"index": 8,
"timestamp": 1538150406312,
"transactions": [
{
"amount": 12.5,
"sender": "00",
"recipient": "b480c0e0c33511e882d997e72a0a3dec",
"transactionID": "76fc8b80c33711e882d997e72a0a3dec"
},
{
"amount": 12.5,
"sender": "00",
"recipient": "b4897370c33511e89a5b171fe868ea7d",
"transactionID": "800551d0c33711e89a5b171fe868ea7d"
}
],
"nonce": 51136,
"hash": "000097c1c8ba5dee90db06fe12acf10aed1ccc6aab56e730d6b68c3a9edbe657",
"previousBlockHash": "000034d29d4eba96e71f04995b2ceb79e4138c83d3eae3b570419f0f2eb45ec5"
}
],
"pendingTransactions": [
{
"amount": 12.5,
"sender": "00",
"recipient": "b480c0e0c33511e882d997e72a0a3dec",
"transactionID": "914efa90c33711e882d997e72a0a3dec"
},
{
"amount": 12.5,
"sender": "00",
"recipient": "b4a5fc20c33511e898b2b91edfa0f9fc",
"transactionID": "ba264d10c33711e898b2b91edfa0f9fc"
},
{
"amount": 5253,
"sender": "node_3002",
"recipient": "all",
"transactionID": "29233c00c33811e8950dc5fd4be129f7"
},
{
"amount": 203,
"sender": "node_3005",
"recipient": "all",
"transactionID": "439eb6e0c33811e89a5b171fe868ea7d"
},
{
"amount": 303,
"sender": "node_3002",
"recipient": "all",
"transactionID": "5828bd90c33811e8950dc5fd4be129f7"
}
],
"currentNodeUrl": "http://localhost:3004",
"networkNodes": [
"http://localhost:3002",
"http://localhost:3003",
"http://localhost:3001",
"http://localhost:3005"
]
}

console.log(bitcoin.chainIsValid(bc1.chain));
