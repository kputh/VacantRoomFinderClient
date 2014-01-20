/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);

        $(document).bind('pageinit', function() {
            $("#testForm").submit(app.processSubmit);
        });
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        navigator.splashscreen.hide();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    // process submit to web service with only location data
    processSubmit: function(event) {

        $.mobile.changePage("#loadingPage", {
            transition: "slideup"
        });

        // issue ajax query and populate view with results
        var abbr = $("#textinput1").val();
        var serverURL = "http://141.45.201.97:8080/RoomFinderService/" +
                "webresources/rooms/near/" + abbr;
        var jqxhr = $.getJSON(serverURL, function(jsonData) {

            console.log("JSON Data: " + jsonData);

            $("#ResultView li").remove();
            $.each(jsonData, function(index, room) {
                var item = $("#elementTemplate").clone();
                item.text(room.roomAbbr);
                item.appendTo("#ResultView");
            });

            // move to result page
            $.mobile.changePage("#resultPage", {
                transition: "slideup"
            });
        })
                .fail(function(jqxhr, textStatus, error) {

                    var errorMessage = "Request Failed: " +
                            textStatus + ", " + error;

                    console.log(errorMessage);
                    $("#errorMessage").text(errorMessage);

                    $.mobile.changePage("#errorPage", {
                        transition: "slideup"
                    });
                });

        event.preventDefault();
        return false;
    }
};
