# Decentralized Blockchain in Javascript  
## Prototype

## How to run  
* git clone repository
* npm run node_1 will start the first node  
* To start additional nodes: npm run node_x, where x can be 2,3,4,5.  
* There are 5 nodes defined in the package.json file  

## How to use  
### To get the complete blockchain  
```
http://localhost:3001/blockchain
```
### To mine blocks
```
http://localhost:3001/mine
```
### To explore blocks  
```
http://localhost:3001/block-explorer
```
or
```
http://localhost:3001/
```

## How to discover nodes   
### Register and broadcast node  
Make HTML POST message to send node URL to other nodes
Send message to  
```
localhost:3001/register-and-broadcast-node
```
In body include  
```
{
	"newNodeUrl": "http://localhost:3005"
}
```

## How to send transactions   
### Create transaction and broadcast to network  
Send message to
```
localhost:3001/transaction/broadcast
```
In body include
```
{
	"amount": 321,
	"sender": "node_3001",
	"recipient": "all"
}
```
