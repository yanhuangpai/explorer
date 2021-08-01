angular.module('ethExplorer')
    .controller('transactionListCtrl', function ($rootScope, $scope, $location, EventBus) {

        console.log("transactionListCtrl");
        EventBus.Publish('timeClear', 'timeClear');
        var web3 = $rootScope.web3;
        var maxBlocks = 3; // TODO: into setting file or user select
        var maxTran = 3;
        if (maxBlocks > blockNum) { maxBlocks = blockNum + 1; }
        //处理
        var blockNum = $scope.blockNum = parseInt(web3.eth.blockNumber, 10); //当前区块
    
        $scope.transactionsList = [];
        var x = 0;
        while ($scope.transactionsList.length < maxTran) {
            var iNumber = blockNum - x;
            var bs2 = web3.eth.getBlock(iNumber);
            var iAge = Math.floor(Date.now() / 1000) - bs2.timestamp;
            var txCount = web3.eth.getBlockTransactionCount(iNumber);
            x++;
            for (var blockIdx = 0; blockIdx < txCount; blockIdx++) {
                var iTran = web3.eth.getTransactionFromBlock(iNumber, blockIdx);
                var iStatus = web3.eth.getTransactionReceipt(iTran.hash).status == "0x0" ? "Failed" : "Success";
                if (iTran) {
                    var transaction = {
                        id: iTran.hash,
                        blockNumber: iTran.blockNumber,
                        hash: iTran.hash,
                        from: iTran.from,
                        to: iTran.to,
                        gas: iTran.gas,
                        input: iTran.input,
                        value: iTran.value,
                        age: iAge,
                        status: iStatus
                    }
                    $scope.transactionsList.push(transaction);
                  
                }
            }
        }



        var timerT = setInterval(() => {
            //处理
            var blockNum = $scope.blockNum = parseInt(web3.eth.blockNumber, 10); //当前区块
            if (maxBlocks > blockNum) { maxBlocks = blockNum + 1; }
            $scope.transactionsList = [];
            var x = 0;
            while ($scope.transactionsList.length < maxTran) {
                var iNumber = blockNum - x;
                var bs2 = web3.eth.getBlock(iNumber);
                var iAge = Math.floor(Date.now() / 1000) - bs2.timestamp;
                var txCount = web3.eth.getBlockTransactionCount(iNumber);
                x++;
                for (var blockIdx = 0; blockIdx < txCount; blockIdx++) {
                    var iTran = web3.eth.getTransactionFromBlock(iNumber, blockIdx);
                    var iStatus = web3.eth.getTransactionReceipt(iTran.hash).status == "0x0" ? "Failed" : "Success";
                    if (iTran) {
                        var transaction = {
                            id: iTran.hash,
                            hash: iTran.hash,
                            from: iTran.from,
                            to: iTran.to,
                            gas: iTran.gas,
                            input: iTran.input,
                            value: iTran.value,
                            age: iAge,
                            status: iStatus
                        }
                        $scope.transactionsList.push(transaction);
                         
                    }
                }
            }
            console.log('reflash')
            $scope.$apply();
        }, 10000);  
 
        //切换页面时停止自动刷新$routeChangeStart
        $scope.$on('$destroy', function (angularEvent, current, previous) {
           
                clearInterval(timerT);
                timerT = null;
           
        }); 
       
    });
