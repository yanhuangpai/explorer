const web3 = new Web3("ws://13.212.195.142:8546")
web3.eth.subscribe("newHeads").then(console.log)
