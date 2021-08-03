angular.module('ethExplorer')
    .controller('transactionListCtrl', function ($rootScope, $scope, $http, $location, EventBus) {

        console.log("transactionListCtrl");
        EventBus.Publish('timeClear', 'timeClear');
        var web3 = $rootScope.web3;
        //������ֹ����
        var maxTranBlock = parseInt(web3.eth.blockNumber, 10); //��ǰ����;
        var minTranBlock = maxTranBlock - 100;

        $scope.transactionsList = [];

        $http({
            method: 'GET',
            url: 'http://3.36.26.51:7000/v1/transaction?fromBlock=' + minTranBlock + '&toBlock=' + maxTranBlock,
            headers: {
                'APIKey': '0x51d9a52d29c99b6bde0f118fdd829097d18a9f041fc6fa661ace13cb93b7f389'
            }
        }).then(function successCallback(response) {

            var trans = response.data.transactions;
            for (var blockIdx = 0; blockIdx < trans.length; blockIdx++) {
                var iTran = trans[0];
                var iStatus = iTran.state == "1" ? "Success" : "Failed";
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
                        age: iTran.age,
                        status: iStatus
                    }
                    $scope.transactionsList.push(transaction);
                }
            }
            $scope.transactionsList = response.data.transactions;
        }, function errorCallback(response) {
            console.log("transactions:error");
        });

        //�������
        var timerM = setInterval(() => {

            //������ֹ����
            maxTranBlock = parseInt(web3.eth.blockNumber, 10); //��ǰ����;
            minTranBlock = maxTranBlock - 100;

            $scope.transactionsList = [];

            $http({
                method: 'GET',
                url: 'http://3.36.26.51:7000/v1/transaction?fromBlock=' + minTranBlock + '&toBlock=' + maxTranBlock,
                headers: {
                    'APIKey': '0x51d9a52d29c99b6bde0f118fdd829097d18a9f041fc6fa661ace13cb93b7f389'
                }
            }).then(function successCallback(response) {

                var trans = response.data.transactions;
                for (var blockIdx = 0; blockIdx < trans.length; blockIdx++) {
                    var iTran = trans[0];
                    var iStatus = iTran.state == "1" ? "Success" : "Failed";
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
                            age: iTran.age,
                            status: iStatus
                        }
                        $scope.transactionsList.push(transaction);
                    }
                    if ($scope.transactionsList.length > 15) break;
                }
                $scope.transactionsList = response.data.transactions;
            }, function errorCallback(response) {
                console.log("transactions:error");
            });
            //������� 
            console.log('reflash');
            $scope.$apply();
        }, 10000);
        //�л�ҳ��ʱֹͣ�Զ�ˢ��$routeChangeStart
        $scope.$on('$destroy', function (angularEvent, current, previous) {

            clearInterval(timerT);
            timerT = null;

        });
        return;
        //-------------------------------------����Ĳ�Ҫweb3
        var maxBlocks = 3; // TODO: into setting file or user select
        var maxTran = 3;
        if (maxBlocks > blockNum) { maxBlocks = blockNum + 1; }
        //����
        var blockNum = $scope.blockNum = parseInt(web3.eth.blockNumber, 10); //��ǰ����

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
            //����
            var blockNum = $scope.blockNum = parseInt(web3.eth.blockNumber, 10); //��ǰ����
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



    });
