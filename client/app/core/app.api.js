(function () {
    'use strict';
    var App = angular.module('app');
    App.factory('$api', ['$resource', '$constant', function ($resource, $constant) {
        var apiMethods = function () {
            return {
                get: {
                    method: 'GET',
                    cache: false,
                    withCredentials: true
                },
                post: {
                    method: 'POST',
                    cache: false,
                    withCredentials: true
                },
                put: {
                    method: 'PUT',
                    cache: false,
                    withCredentials: true
                },
                delete: {
                    method: 'DELETE',
                    cache: false,
                    withCredentials: true
                },
                options: {
                    method: 'OPTIONS',
                    cache: false,
                    withCredentials: true
                }
            };
        };
        return {
            //Module manage api
            ModuleManage:$resource($constant.apiUrl + 'app/:action', {
                action: '@action',
                pageNumber: '@pageNumber', pageSize: '@pageSize', orderBy: '@orderBy', orderType: '@orderType'
            }, apiMethods()),

            //Construction API
            Construction: $resource($constant.apiUrl + 'construction/:action', {
                action: '@action',
                pageNumber: '@pageNumber', pageSize: '@pageSize', orderBy: '@orderBy', orderType: '@orderType'
            }, apiMethods()),
            //ConstructionDesign API
            ConstructionDesign: $resource($constant.apiUrl + 'constructionDesign/:action', {
                action: '@action'
            }, apiMethods()),
            //VCategory API
            VCategory: $resource($constant.apiUrl + 'vdesign-category/:action', {
                action: '@action',
                keywords: '@keywords',
                pageNumber: '@pageNumber', pageSize: '@pageSize', orderBy: '@orderBy', orderType: '@orderType'
            }, apiMethods()),
            //Category API
            Category: $resource($constant.apiUrl + 'design-category/:action', {
                action: '@action',
                id: '@id'
            }, apiMethods()),
            //Category API
            ConstructionCategory: $resource($constant.apiUrl + 'category/:action', {
                action: '@action',
                constructId: '@constructId', constructionDesignId: '@constructionDesignId'
            }, apiMethods()),
            //CategoryControl API
            VCategoryControl: $resource($constant.apiUrl + 'vcontrol/:action', {
                action: '@action',
                id: '@id',
                pageNumber: '@pageNumber', pageSize: '@pageSize', orderBy: '@orderBy', orderType: '@orderType'
                ,constructType : '@constructType'
            }, apiMethods()),
            //CategoryControl API
            CategoryControl: $resource($constant.apiUrl + 'control/:action', {
                action: '@action',
                id: '@id',
                page: '@page'
            }, apiMethods()),
            //Design node API
            DesignNode: $resource($constant.apiUrl + 'designNode/:action', {
                action: '@action'
            }, apiMethods()),
            //Estimate API
            Estimate: $resource($constant.apiUrl + 'constructionEstimate/:action', {
                action: '@action'
            }, apiMethods())
        };
    }]);
})();
