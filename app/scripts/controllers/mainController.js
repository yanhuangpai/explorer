angular.module('ethExplorer')
    .controller('mainCtrl', function ($rootScope, $scope, $location) {

	var web3 = $rootScope.web3;
	var maxBlocks = 50; // TODO: into setting file or user select
	var blockNum = $scope.blockNum = parseInt(web3.eth.blockNumber, 10);
	if (maxBlocks > blockNum) {
	    maxBlocks = blockNum + 1;
	}

	// get latest 50 blocks
	$scope.blocks = [];
	for (var i = 0; i < maxBlocks; ++i) {
	    $scope.blocks.push(web3.eth.getBlock(blockNum - i));
	}

  	// get latest 10 transactions
	$scope.transactions = [];
  var blocks = $scope.blocks;
  blocks.forEach(e=> {
    var trx = e.transactions;
    var count = trx.length;
    var age = Math.floor(Date.now() / 1000) - e.timestamp;
    for(var j=0; j<count; j++) {
      var tx = web3.eth.getTransaction(trx[j]);
      tx.timestamp = age;
      var ss = web3.eth.getTransactionReceipt(trx[j]).status;
      if(ss=="0x0"){
        tx.status = "Failed";
      } else {
        tx.status = "Success";
      }
      $scope.transactions.push(tx);
    }
  })
	
        $scope.processRequest = function() {
             var requestStr = $scope.ethRequest.split('0x').join('');

            if (requestStr.length === 40)
              return goToAddrInfos(requestStr)
            else if(requestStr.length === 64) {
              if(/[0-9a-zA-Z]{64}?/.test(requestStr))
                return goToTxInfos('0x'+requestStr)
              else if(/[0-9]{1,7}?/.test(requestStr))
                return goToBlockInfos(requestStr)
            }else if(parseInt(requestStr) > 0)
              return goToBlockInfos(parseInt(requestStr))

            alert('Don\'t know how to handle '+ requestStr)
        };


        function goToBlockInfos(requestStr) {
            $location.path('/block/'+requestStr);
        }

        function goToAddrInfos(requestStr) {
            $location.path('/address/'+requestStr);
        }

         function goToTxInfos (requestStr) {
             $location.path('/transaction/'+requestStr);
        }

    });
