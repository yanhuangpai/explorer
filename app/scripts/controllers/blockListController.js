angular.module('ethExplorer')
    .controller('blockListCtrl', function ($rootScope, $scope, $location,EventBus) {
         
        console.log("blockListCtrl");
        EventBus.Publish('timeClear', 'timeClear');
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

        //切换页面时停止自动刷新$routeChangeStart
        $scope.$on('$destroy', function (angularEvent, current, previous) { 
                clearInterval(timerB);
                timerB = null; 
                console.log('Close blockList reflash');
        }); 
     

    });
