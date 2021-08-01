'use strict';

var myApp = angular.module('ethExplorer', ['ngRoute', 'ui.bootstrap']);

myApp.service("EventBus", [function () {
    var subscriberList = [];
    function _subscribe(evt, fn) {
        for (var i = 0; i < subscriberList.length; ++i) {
            if (subscriberList[i].Event === evt && subscriberList[i].Fn === fn) {
                return;
            }
        }
        subscriberList.push({ Event: evt, Fn: fn });
    }
    function _unsubscribe(evt, fn) {

        for (var i = 0; i < subscriberList.length; ++i) {
            if (subscriberList[i].Event === evt && subscriberList[i].Fn === fn) {
                break;
            }
        }
        subscriberList.splice(i, 1);

    }
    function _publish(evt, data) {

        for (var i = 0; i < subscriberList.length; ++i) {
            if (subscriberList[i].Event === evt) {
                subscriberList[i].Fn(data);
            }
        }
    }
    return {
        Subscribe: _subscribe,
        Unsubscribe: _unsubscribe,
        Publish: _publish
    }
}]);

myApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'views/main.html',
                controller: 'mainCtrl'
            }).
            when('/transactionList/', {
                templateUrl: 'views/transactionList.html',
                controller: 'transactionListCtrl'
            }).
            when('/blockList/', {
                templateUrl: 'views/blockList.html',
                controller: 'blockListCtrl'
            }).
            when('/signerList/', {
                templateUrl: 'views/signerList.html',
                controller: 'signerListCtrl'
            }).

            when('/block/:blockId', {
                templateUrl: 'views/blockInfos.html',
                controller: 'blockInfosCtrl'
            }).
            when('/txlist', {
                templateUrl: 'views/txlist.html',
                controller: 'mainCtrl'
            }).
            when('/transaction/:transactionId', {
                templateUrl: 'views/transactionInfos.html',
                controller: 'transactionInfosCtrl'
            }).
            when('/address/:addressId', {
                templateUrl: 'views/addressInfo.html',
                controller: 'addressInfoCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
    }])
    .run(function ($rootScope) {
        var web3 = new Web3();
 
        //var eth_node_url = 'http://localhost:8545';
        var eth_node_url = 'http://18.163.112.243:8545'; // TODO: remote URL
        web3.setProvider(new web3.providers.HttpProvider(eth_node_url));
  
        $rootScope.web3 = web3;
        function sleepFor(sleepDuration) {
            var now = new Date().getTime();
            while (new Date().getTime() < now + sleepDuration) { /* do nothing */ }
        }
        var connected = false;
        if (!web3.isConnected()) {
            $('#connectwarning').modal({ keyboard: false, backdrop: 'static' })
            $('#connectwarning').modal('show')
        }
    });
