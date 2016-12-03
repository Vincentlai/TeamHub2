/**
 * Created by Qiang Lai on 2016/11/17.
 */
;(function () {
    'use strict';
    var module = angular.module('event', []);
    module.controller('calendarController', [
        '$http',
        'Auth',
        '$state',
        '$scope',
        '$timeout',
        '$rootScope',
        '$stateParams',
        'eventList',
        function ($http, Auth, $state, $scope,
                  $timeout, $rootScope,
                  $stateParams, eventList) {

            //initial data
            $scope.events = eventList;
            $scope.listView = true;
            $scope.detailView = false;
            $scope.formView = false;

            function deleteEventFromDatabase(deleteEventID) {
                $http.delete('/events/delete?event_id=' + deleteEventID)
                    .then(
                        function (response) {
                            if (response.data.code == 1) {
                                $timeout(function () {
                                    $state.transitionTo($state.current.name, {team_id: $rootScope.selectedTeamId},
                                        {reload: $state.current.name, inherit: false, notify: true});
                                }, 500);

                            } else {
                                console.log("error message in response");
                                console.log(response.data.code);
                            }
                        }, function (error) {
                            console.log('error in delete event info' + error);
                        });
            }

            $scope.deleteEvent = function (event) {
                deleteEventFromDatabase(event.event_id);
            };

            $scope.createEvent = function () {
                var createdEvent = {};
                createdEvent.team_id = $rootScope.selectedTeamId;
                createdEvent.title = $scope.newEventTitle;
                createdEvent.start = new Date($scope.eventStartDate.getTime()
                    + $scope.eventStartTimeHour * 60 * 60 * 1000
                    + $scope.eventStartTimeMin * 60 * 1000);
                createdEvent.end = new Date($scope.eventEndDate.getTime()
                    + $scope.eventEndTimeHour * 60 * 60 * 1000
                    + $scope.eventEndTimeMin * 60 * 1000);
                createdEvent.description = $scope.eventDescription;
                //createdEvent.allDayEvent = $scope.allDayEvent;
                sendToDataBase(createdEvent);
            };

            // $scope.errorMessageShow = function () {
            //     var startTime = $scope.eventStartDate.getTime()
            //         + $scope.eventStartTimeHour * 60 * 60 * 1000
            //         + $scope.eventStartTimeMin * 60 * 1000;
            //     var endTime = $scope.eventEndDate.getTime()
            //         + $scope.eventEndTimeHour * 60 * 60 * 1000
            //         + $scope.eventEndTimeMin * 60 * 1000;
            //     var result = endTime - startTime;
            //     if (result < 0) {
            //         return true;
            //     } else {
            //         return false;
            //     }
            // };

            function sendToDataBase(createdEvent) {
                $http.post('/events/create', createdEvent)
                    .then(
                        function (response) {
                            if (response.data.code == 1) {
                                $timeout(function () {
                                    $state.transitionTo($state.current.name, {team_id: $rootScope.selectedTeamId},
                                        {reload: $state.current.name, inherit: false, notify: true});
                                }, 500);
                            } else {
                                console.log("error message in response");
                                console.log(response.data.msg);
                            }
                        }, function (error) {
                            console.log('error in create events' + error);
                        }
                    )
            }


            function currentDay(date) {
                var tempDate = date.getTime();
                $scope.eventStartDate = new Date(tempDate);
                $scope.eventEndDate = new Date(tempDate);
                return date.toDateString();
            }

            var deleteEventID;
            var chosenEventCreatorID;
            //var chosenEventTitle;
            //var chosenEventStart;
            //var chosenEventEnd;
            //var chosenEventDescription;
            $scope.changeView = function (new_view) {
                if (new_view == 'detail') {
                    $scope.listView = false;
                    $scope.formView = false;
                    $scope.detailView = true;
                } else if (new_view == 'list') {
                    $scope.formView = false;
                    $scope.detailView = false;
                    $scope.listView = true;
                } else {
                    $scope.detailView = false;
                    $scope.listView = false;
                    $scope.formView = true;
                }
            };

            $scope.detail = function (event) {
                $scope.changeView('detail');
            };

            $scope.eventClicked = function (item) {
                $scope.changeView('detail');
                $scope.selected_event = item;
            };

            $scope.createClicked = function (date) {
                $scope.changeView('form');
                $scope.result = currentDay(date);
            };

            $scope.resetTime = function () {
                $scope.eventStartTimeHour = 0;
                $scope.eventStartTimeMin = 0;
                $scope.eventEndTimeHour = 0;
                $scope.eventEndTimeMin = 0;
            };

            $scope.dis = false;

        }
    ]);

}());