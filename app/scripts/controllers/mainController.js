<<<<<<< HEAD

angular.module('ethExplorer').controller('mainCtrl', function ($rootScope, $scope, $http, EventBus) {
    console.log("mainCtrl");
    var web3 = $rootScope.web3;
    //起止区块
    var maxblock = parseInt(web3.eth.blockNumber, 10); //当前区块
    var minBlock = maxblock - 15;
    //交易起止区块
    var maxTranBlock = maxblock;
    var minTranBlock = maxTranBlock - 100;
    $scope.blocks = [];
    $scope.transactionsList = [];
    $http({
        method: 'GET',
        url: 'http://3.36.26.51:7000/v1/block?fromBlock=' + minBlock + '&toBlock=' + maxblock,
        headers: {
            'APIKey': '0x51d9a52d29c99b6bde0f118fdd829097d18a9f041fc6fa661ace13cb93b7f389'
        }
    }).then(function successCallback(response) {
        console.log("Block:", response);
        $scope.blocks = response.data.blocks;
    }, function errorCallback(response) {
        console.log("Block:error");
    });
    $http({
        method: 'GET',
        url: 'http://3.36.26.51:7000/v1/transaction?fromBlock=' + minTranBlock + '&toBlock=' + maxTranBlock,
        headers: {
            'APIKey': '0x51d9a52d29c99b6bde0f118fdd829097d18a9f041fc6fa661ace13cb93b7f389'
        }
    }).then(function successCallback(response) {
        console.log("transactions:", response);
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

    //处理结束
    var timerM = setInterval(() => {
        maxblock = parseInt(web3.eth.blockNumber, 10); //当前区块
        minBlock = maxblock - 15;
        maxTranBlock = maxblock;
        minTranBlock = maxTranBlock - 100;
        $scope.blocks = [];
        $scope.transactionsList = [];
        $http({
            method: 'GET',
            url: 'http://3.36.26.51:7000/v1/block?fromBlock=' + minBlock + '&toBlock=' + maxblock,
            headers: {
                'APIKey': '0x51d9a52d29c99b6bde0f118fdd829097d18a9f041fc6fa661ace13cb93b7f389'
            }
        }).then(function successCallback(response) {

            $scope.blocks = response.data.blocks;
        }, function errorCallback(response) {
            console.log("Block:error");
        });
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
        //处理结束 
        console.log('reflash');
        $scope.$apply();
    }, 10000);

    EventBus.Subscribe("timeClear", timeClear);
    function timeClear(data) {
        clearInterval(timerM);
        timerM = null;

    }
    //切换页面时停止自动刷新$routeChangeStart
    $scope.$on('$destroy', function (angularEvent, current, previous) {
        clearInterval(timerM);
        timerM = null;
        console.log('Close blockList reflash');
    });

    return;
    //-------------------------------------下面的不要web3
    var web3 = $rootScope.web3;
    var maxBlocks = 3; // TODO: into setting file or user select
    var maxTran = 3;
    //处理开始
    var blockNum = $scope.blockNum = parseInt(web3.eth.blockNumber, 10); //当前区块
    if (maxBlocks > blockNum) { maxBlocks = blockNum + 1; }

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
    //处理结束
    var timerM = setInterval(() => {
        //处理开始
        var blockNum = $scope.blockNum = parseInt(web3.eth.blockNumber, 10); //当前区块
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
        //处理结束 
        console.log('reflash');
        $scope.$apply();
    }, 10000);

    EventBus.Subscribe("timeClear", timeClear);
    function timeClear(data) {
        clearInterval(timerM);
        timerM = null;

    }








});
=======

angular.module('ethExplorer')
 
    .controller('mainCtrl', function ($rootScope, $scope, $location, EventBus) {
        console.log("mainCtrl");
        var web3 = $rootScope.web3;
        var maxBlocks = 3; // TODO: into setting file or user select
        var maxTran = 3;
        //锟斤拷锟斤拷始
        var blockNum = $scope.blockNum = parseInt(web3.eth.blockNumber, 10); //锟斤拷前锟斤拷锟?        if (maxBlocks > blockNum) { maxBlocks = blockNum + 1; }
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
        //锟斤拷锟斤拷锟斤拷锟?        var timerM = setInterval(() => {
            //锟斤拷锟斤拷始
            var blockNum = $scope.blockNum = parseInt(web3.eth.blockNumber, 10); //锟斤拷前锟斤拷锟?            if (maxBlocks > blockNum) { maxBlocks = blockNum + 1; }
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
            //锟斤拷锟斤拷锟斤拷锟?
            console.log('reflash');
            $scope.$apply();
        }, 10000);

        EventBus.Subscribe("timeClear", timeClear);
        function timeClear(data) {
            clearInterval(timerM);
            timerM = null;

        }








    });
>>>>>>> f8ad5d10bab2de7847a93ebc48314decda045887
