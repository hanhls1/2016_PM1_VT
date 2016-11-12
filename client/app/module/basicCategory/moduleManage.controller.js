(function () {
    'use strict';

    angular.module('app.table')
        .controller('ModuleManageCtrl', ['$scope', '$filter','kendoConfig', '$api','$compile', '$mdToast', TableCtrl]);

    function TableCtrl($scope, $filter,kendoConfig, $api,$compile,$mdToast) {
        var init;
        $scope.appForm ={};
        $scope.searchForm={  };
        $scope.isShowSearch=true;
        $scope.isNew = true;
        $scope.multichoice=[];
        // Tìm kiếm module
        $scope.searchModuleManage=function() {
            $scope.searchParameters.pageNumber = 0;
            $scope.grid.dataSource.read();
        };


        $scope.totalRecords = 25;

        $scope.searchParameters = {
            action: 'search', // action to call API
            pageNumber: 0, // start || current page
            pageSize: 10, // records per page (default:10 records)
            orderBy: 'name', // field || column
            orderType: 'desc' // asc || desc
        };

        $scope.moduleManageDatasource = {
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            allowUnsort: true,
            schema: {
                data: function (data) {
                    return data;
                },
                total: function (data) {
                    return $scope.totalRecords;
                },model:{
                    fields:{
                        name:{type:"string"},
                        code:{type:"string"},
                        description:{type:"string"}
                    }
                }
            },
            pageSize: 50,
            transport: {
                read: function (e) {
                    $scope.buildParameters(e.data);
                    $api.ModuleManage.post($scope.searchParameters, $scope.searchForm).$promise.then(function (response) {
                        $scope.totalRecords = response.data.total;
                        e.success(response.data.data);
                        $scope.selectedItem = undefined;
                    }).catch(function (err) {
                        console.log('Không thể kết nối để lấy dữ liệu: ' + err.data.errorMessage);
                    });
                }
            }
        };

        $scope.buildParameters = function (data) {
            if (!angular.isUndefined(data.sort) && data.sort.length > 0) {
                $scope.searchParameters.orderBy = data.sort[0].field || "";
                $scope.searchParameters.orderType = data.sort[0].dir || "asc";
            }
            if (!angular.isUndefined(data.filter) && !angular.isUndefined(data.filter.filters) && data.filter.filters.length > 0) {
                angular.forEach(data.filter.filters, function (value, key) {
                    $scope.search[value.field] = value.value;
                });
            }
            $scope.searchParameters.pageSize = data.pageSize || 50;
            $scope.searchParameters.pageNumber = (data.page - 1) || 0;
        };
        $scope.canSubmit = function() {
            return $scope.appFormInfo.$valid;
        };
        $scope.moduleManage = [
			{	width: 50,
			    template: "<input type='checkbox' class='checkbox' ng-model='dataItem.selected' ng-click='onCheckBoxClick($event, dataItem)' />",
		        title: "<input type='checkbox' title='Select all' ng-click='toggleSelectAll($event)' />"
			},
            {
                title: "STT",
                field: "rowNumber",
                attributes: {class: "text-center"},
                type: "number",
                sortable: true,
                filterable: false,
                reorderable: true,
                resizable: true,
                columnMenu: true,
                width: 65
            }, {
                title: 'Hành động'
                , width: 80
                , template: "<a title=\"Chỉnh sửa\" href=\"javascript:;\" class=\"btn btn-circle btn-icon-only blue btn-outline btn-success\" ng-click=\"editApp(dataItem)\"><i class=\"fa fa-pencil\"></i></a>   "
                        + "<a title=\"Xóa\" href=\"javascript:;\" class=\"btn btn-circle btn-icon-only btn-default red btn-outline btn-danger\" ng-click=\"deleteApp(dataItem)\"><i class=\"fa fa-remove\"></i></a>"
            },

            {
                title: "Mã ứng dụng",
                field: "code",
                type: "string",
                width: 120
            },
            {
                title: "Tên ứng dụng",
                field: "name",
                type: "string",
                width: 300
            },
            {
                title: "Mô tả",
                field: "description",
                type: "string",
                width: 200
            },
            {
                title: "Trạng thái",
                field: "status",
                template: function (item) {
                    switch (item.approveStatus) {
                        case null:
                            return "";
                            break;
                        case 1:
                            return "Hoạt động";
                            break;
                        case 2:
                            return "Khóa";
                            break;
                        default:
                            return "";
                            break;
                    }
                },
                attributes: {class: "text-center"},
                type: "number",
                width: 150
            }
        ];
// $scope.getTemplateBySelector = function (selector) {
// return angular.element(selector).html();
// };
        $scope.gridOptions = {
            dataSource: $scope.moduleManageDatasource,
            toolbar:
                kendo.template($("#toolbar").html()),
             excel: {
	             allPages: true,
	             fileName: "danh-sach-ung-dung.xlsx"
             },
            dataBound: function () {
                // this.expandRow(this.tbody.find("tr.k-master-row").first());
                angular.forEach(this.items(), function (item, i) {
                    var rowScope = angular.element(item).scope();
                    rowScope.dataItem.rowNumber = i + 1 + ($scope.searchParameters.pageNumber * $scope.searchParameters.pageSize);
                    rowScope.dataItem.selected = false;
                });
            },
            navigatable: true,
            reorderable: true,
            columnMenu: true,
            //selectable: true,
            sortable: true,
            resizable: true,
            height: 450,
            autobind: false,
            editable: false,
            selectable: "multiple",
//            filterable: {
//                extra: false,
//                operators: {
//                    string: {
//                        contains: "Contains"
//                    },
//                    number: {
//                        eq: 'Is equal to'
//                    }
//                }
//            },
            pageable: {
                pageSizes: [10, 25, 50, 100],
                change: function (e) {
                    $scope.searchParameters.pageNumber = parseInt(e.index) - 1;
                }
            },

            columns: $scope.moduleManage
        };



        $scope.gridChange = function (dataItem) {
            $scope.selectedItem = dataItem;
        };

        $scope.save = function(valid){
        	//if (!valid) return;
           // var putParams = {
           //         name: $scope.appForm.name,
           //         code: $scope.appForm.code,
           //         description: $scope.appForm.description,
           //         id: $scope.appForm.id
           //};

            //var action = 'add';
            //if (!angular.isUndefined(putParams.id) && putParams.id !== 0) {
            //    action = 'update';
            //}
            //var kendoWindow = $("<div/>").kendoWindow({
            //    title: "Thông báo",
            //    resizable: false,
            //    modal: true
            //});
            //
            //kendoWindow.data("kendoWindow")
            //        .content($compile($("#save-app-confirmation").html())($scope))
            //        .center().open();
            //
            //kendoWindow
            //        .find(".save-confirm,.save-cancel")
            //        .click(function () {
            //            if ($(this).hasClass("save-confirm")) {
				//        	// debugger;
				//            $api.ModuleManage.post({action: action}, putParams).$promise.then(function (response) {
				//                if (response.status === 200)
				//                {
				//                	$scope.showMessage(response.errorMessage);
				//                    $scope.appForm.id = response.data.id;
				//                } else {
				//                	$scope.showMessage(response.errorMessage);
				//                }
				//                $scope.appForm = {};
				//            }).catch(function (err) {
				//            	$scope.showMessage(angular.isUndefined(err.error) ? "Lỗi không xác định" : err.error);
            //
				//            });
            //            }
            //            kendoWindow.data("kendoWindow").close();
            //       })
            //        .end();
        }

        $scope.deleteApp = function(dataItem){
            //$scope.appSelected = dataItem;
            //var kendoWindow = $("<div/>").kendoWindow({
            //    title: "Thông báo",
            //    resizable: false,
            //    modal: true
            //});
            //
            //kendoWindow.data("kendoWindow")
            //        .content($compile($("#delete-app-confirmation").html())($scope))
            //        .center().open();
            //
            //kendoWindow
            //        .find(".delete-confirm,.delete-cancel")
            //        .click(function () {
            //            if ($(this).hasClass("delete-confirm")) {
            //                $api.ModuleManage.post({action: 'delete'},{id: dataItem.id}).$promise.then(function (response) {
            //                    if (response.status == 200)
            //                    {
            //                    	$scope.showMessage(response.errorMessage);
            //                    } else {
            //                    	$scope.showMessage(response.errorMessage);
            //                    }
            //                    $scope.searchModuleManage();
            //                }).catch(function (err) {
            //                	$scope.showMessage(angular.isUndefined(err.error) ? "Lỗi không xác định" : err.error);
            //                });
            //            }
            //
            //            kendoWindow.data("kendoWindow").close();
            //        })
            //        .end();

        }
        $scope.resetForm = function(){
        	//$scope.appForm = {};
        	//$scope.isShowSearch = !$scope.isShowSearch;
        }
        $scope.insertApp = function(){
        	//$scope.isShowSearch=!$scope.isShowSearch;
        	//$scope.isNew = true;
        }
        $scope.editApp = function(updateApp){
            $scope.appForm.id = updateApp.id;
            $scope.appForm.name = updateApp.name;
            $scope.appForm.code = updateApp.code;
            $scope.appForm.description = updateApp.description;
            $scope.isShowSearch=!$scope.isShowSearch;
            //$scope.isNew = false;
        }
        $scope.showMessage = function (msg){
            //$mdToast.show(
          	//      $mdToast.simple()
          	//        .textContent(msg)
          	//        .position('bottom right')
          	//        .hideDelay(5000)
          	//    );
        }
        //export
        //$("#export").click(function (e) {
        //    //var grid = $("#gridCategory").data("kendoGrid");
        //    //grid.saveAsExcel();
        //});
        $scope.toggleSelectAll = function(ev) {
            var grid = $(ev.target).closest("[kendo-grid]").data("kendoGrid");
            var items = grid.dataSource.data();
            items.forEach(function(item){
                item.selected = ev.target.checked;

            });
        };
        $scope.deleteMultichoice = function(){
            //$scope.multichoice=[];
            //var grid = $("#grid").closest("[kendo-grid]").data("kendoGrid");
            //var items = grid.dataSource.data();
            //for(var item in items){
            //	if (item.selected)
            //		$scope.multichoice.push(item);
            //}
            //console.log($scope.multichoice);
            //var kendoWindow = $("<div/>").kendoWindow({
            //    title: "Thông báo",
            //    resizable: false,
            //    modal: true
            //});
            //
            //kendoWindow.data("kendoWindow")
            //        .content($compile($("#delete-app-confirmation").html())($scope))
            //        .center().open();
            //
            //kendoWindow
            //        .find(".delete-confirm,.delete-cancel")
            //        .click(function () {
            //            if ($(this).hasClass("delete-confirm")) {
            //                $api.ModuleManage.post({action: 'deleteMultichoice'}, $scope.multichoice).$promise.then(function (response) {
            //                    if (response.status == 200)
            //                    {
            //                    	$scope.showMessage(response.errorMessage);
            //                    } else {
            //                    	$scope.showMessage(response.errorMessage);
            //                    }
            //                    $scope.searchModuleManage();
            //                }).catch(function (err) {
            //                	$scope.showMessage(angular.isUndefined(err.error) ? "Lỗi không xác định" : err.error);
            //                });
            //            }
            //
            //            kendoWindow.data("kendoWindow").close();
            //        })
            //        .end();
        }
        // init = function() {
        // $scope.search();
        // return $scope.select($scope.currentPage);
        // };

        // init();
    }

})();
