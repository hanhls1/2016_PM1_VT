
//Constant Values
(function () {
    'use strict';
    var App = angular.module('app');
    App.constant('$constant', {
        //api path
        apiUrl: 'http://localhost:8088/pmnd/',
        //authentication path
        authenUrl: '',
        //logout path
        logoutUrl: '',

        //current date time
        currentDateTime: function () {
            return new Date();
        },
        //http status
        httpStatus: {
            success: 0,
            error: 1
        },
        //record number per page
        records: [5, 10, 30, 50, 100],

    });
})();
