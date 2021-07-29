angular.module('ethExplorer')
    .controller('txListCtrl', function ($rootScope, $scope) {
	var web3 = $rootScope.web3;
	var blockNum = $scope.blockNum = parseInt(web3.eth.blockNumber, 10);
  var maxBlocks = blockNum ; 
  var maxTx = 10 ;    // TODO: into setting file or user select
	if (maxBlocks > blockNum) {
	    maxBlocks = blockNum + 1;
	}

	// get latest 10 transactions
	$scope.transactions = [];
  var j = 0;
	for (var i = 0; i < maxBlocks; ++i) {
    web3.eth.getBlockTransactionCount(blockNum - i, function(error, result){
      var txCount = result
      for (var blockIdx = 0; blockIdx < txCount; blockIdx++) {
        j++;
        if(j>=maxTx){
          break;
        }
        web3.eth.getTransactionFromBlock(blockNum - i, blockIdx, function(error, result) {
          var transaction = {
            id: result.hash,
            hash: result.hash,
            from: result.from,
            to: result.to,
            gas: result.gas,
            input: result.input,
            value: result.value
          }
          $scope.$apply(
            $scope.transactions.push(transaction)
          )
        })
      }
    })
	}
  });
