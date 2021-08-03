angular.module('ethExplorer')
    .controller('blockListCtrl', function ($rootScope, $scope, $location, $http, EventBus) {

        console.log("blockListCtrl");
        EventBus.Publish('timeClear', 'timeClear');
        var web3 = $rootScope.web3;
        var maxblock = parseInt(web3.eth.blockNumber, 10); //��ǰ����
        var minBlock = maxblock - 15;
        $scope.blocks = [];
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

        var timerB = setInterval(() => {

            //��������Ҫ��ʱˢ�µ��߼�
            maxblock = parseInt(web3.eth.blockNumber, 10); //��ǰ����
            minBlock = maxblock - 15;
            $scope.blocks = [];
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
            $scope.$apply();
            console.log('reflash');
        }, 10000);

        //�л�ҳ��ʱֹͣ�Զ�ˢ��$routeChangeStart
        $scope.$on('$destroy', function (angularEvent, current, previous) {
            clearInterval(timerB);
            timerB = null;
            console.log('Close blockList reflash');
        });

        return;
        //-------------------------------------����Ĳ�Ҫweb3
        var web3 = $rootScope.web3;
        var maxBlocks = 3; // TODO: into setting file or user select
        var maxTran = 3;
        if (maxBlocks > blockNum) { maxBlocks = blockNum + 1; }
        //����
        var blockNum = $scope.blockNum = parseInt(web3.eth.blockNumber, 10); //��ǰ����
        if (maxBlocks > blockNum) { maxBlocks = blockNum + 1; }
        var transactionCount = 0;
        $scope.blocks = [];
        while ($scope.blocks.length < maxBlocks) {
            var bs = web3.eth.getBlock(blockNum - $scope.blocks.length);
            $scope.blocks.push(bs);
        }


        var timerB = setInterval(() => {

            //��������Ҫ��ʱˢ�µ��߼�
            var blockNum = $scope.blockNum = parseInt(web3.eth.blockNumber, 10); //��ǰ����
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
