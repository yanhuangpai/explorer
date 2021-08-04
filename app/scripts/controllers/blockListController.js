angular.module('ethExplorer')
    .controller('blockListCtrl', function ($rootScope, $scope, $location, $http, EventBus) {

        console.log("blockListCtrl");
        EventBus.Publish('timeClear', 'timeClear');
        var web3 = $rootScope.web3;
        //起止区块
        var maxblock = parseInt(web3.eth.blockNumber, 10); //当前区块 
        var minBlock = maxblock - 15;
        
        $scope.blocks = [];
      
        $http({
            method: 'GET',
            url: 'http://3.36.26.51:7000/v1/block?fromBlock=' + minBlock + '&toBlock=' + maxblock,
            headers: {
                'APIKey': '0x51d9a52d29c99b6bde0f118fdd829097d18a9f041fc6fa661ace13cb93b7f389'
            }
        }).then(function successCallback(response) {
            var bk = response.data.blocks;
            for (var blockIdx = bk.length - 1; blockIdx > 0; blockIdx--) {
                $scope.blocks.push(bk[blockIdx]);
                if ($scope.blocks.length > 15) break;
            }
        }, function errorCallback(response) {
            console.log("Block:error");
        });
         

        //处理结束
        var timerM = setInterval(() => {
            maxblock = parseInt(web3.eth.blockNumber, 10); //当前区块
            minBlock = maxblock - 15; 
            $scope.blocks = [];
           
            $http({
                method: 'GET',
                url: 'http://3.36.26.51:7000/v1/block?fromBlock=' + minBlock + '&toBlock=' + maxblock,
                headers: {
                    'APIKey': '0x51d9a52d29c99b6bde0f118fdd829097d18a9f041fc6fa661ace13cb93b7f389'
                }
            }).then(function successCallback(response) {
                var bk = response.data.blocks;
                for (var blockIdx = bk.length - 1; blockIdx > 0; blockIdx--) {

                    $scope.blocks.push(bk[blockIdx]);
                }
            }, function errorCallback(response) {
                console.log("Block:error");
            }); 
            //处理结束 
            console.log('reflash');
            $scope.$apply();
        }, 10000);

        //切换页面时停止自动刷新$routeChangeStart
        $scope.$on('$destroy', function (angularEvent, current, previous) {
            clearInterval(timerB);
            timerB = null;
            console.log('Close blockList reflash');
        });

        return;
        //-------------------------------------下面的不要web3
        var web3 = $rootScope.web3;
        var maxBlocks = 3; // TODO: into setting file or user select
        var maxTran = 3;
        if (maxBlocks > blockNum) { maxBlocks = blockNum + 1; }
        //处理
        var blockNum = $scope.blockNum = parseInt(web3.eth.blockNumber, 10); //当前区块
        if (maxBlocks > blockNum) { maxBlocks = blockNum + 1; }
        var transactionCount = 0;
        $scope.blocks = [];
        while ($scope.blocks.length < maxBlocks) {
            var bs = web3.eth.getBlock(blockNum - $scope.blocks.length);
            $scope.blocks.push(bs);
        }


        var timerB = setInterval(() => {

            //这里是想要定时刷新的逻辑
            var blockNum = $scope.blockNum = parseInt(web3.eth.blockNumber, 10); //当前区块
            if (maxBlocks > blockNum) { maxBlocks = blockNum + 1; }
            var transactionCount = 0;
            $scope.blocks = [];
            $scope.transactionsList = [];
            while ($scope.blocks.length < maxBlocks) {
                var bs = web3.eth.getBlock(blockNum - $scope.blocks.length);
                $scope.blocks.push(bs);
            }
            $scope.$apply();
            console.log('reflash');
        }, 10000);




    });
