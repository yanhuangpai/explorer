
angular.module('ethExplorer')
 
    .controller('mainCtrl', function ($rootScope, $scope, $location, EventBus) {
        console.log("mainCtrl");
        var web3 = $rootScope.web3;
        var maxBlocks = 15; // TODO: into setting file or user select
        var maxTran = 15;
        //����ʼ
        var blockNum = $scope.blockNum = parseInt(web3.eth.blockNumber, 10); //��ǰ���
        if (maxBlocks > blockNum) { maxBlocks = blockNum + 1; }
        $scope.blocks = [];
        $scope.transactionsList = [];
        while ($scope.blocks.length < maxBlocks) {
            var bs = web3.eth.getBlock(blockNum - $scope.blocks.length);
            $scope.blocks.push(bs);
        }
        var x = 0;
        while ($scope.transactionsList.length < maxTran) {
            var iNumber = blockNum - x;
            var bs2 = web3.eth.getBlock(iNumber);
            var iAge = Math.floor(Date.now() / 1000) - bs2.timestamp;
            var txCount = bs2.transactions.length;// web3.eth.getBlockTransactionCount(iNumber);
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
        //�������
        var timerM = setInterval(() => {
            //����ʼ
            var blockNum = $scope.blockNum = parseInt(web3.eth.blockNumber, 10); //��ǰ���
            if (maxBlocks > blockNum) { maxBlocks = blockNum + 1; }
            $scope.blocks = [];
            $scope.transactionsList = [];
            while ($scope.blocks.length < maxBlocks) {
                var bs = web3.eth.getBlock(blockNum - $scope.blocks.length);
                $scope.blocks.push(bs);

            }
            var x = 0;
            while ($scope.transactionsList.length < maxTran) {
                var iNumber = blockNum - x;
                var bs2 = web3.eth.getBlock(iNumber);
                var iAge = Math.floor(Date.now() / 1000) - bs2.timestamp;
                var txCount = bs2.transactions.length;// web3.eth.getBlockTransactionCount(iNumber);
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
            //������� 
            console.log('reflash');
            $scope.$apply();
        }, 10000);

        EventBus.Subscribe("timeClear", timeClear);
        function timeClear(data) {
            clearInterval(timerM);
            timerM = null;

        }








    });
