"use strict";angular.module("samsungEnterpriseApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ui.router","gsDirectives","ui.keypress","ngTouch","ngTell"]).constant("AppConfig",{backend:{enabled:!1}}).config(["$stateProvider","$urlRouterProvider","$compileProvider",function(a,b,c){a.state("login",{url:"/",templateUrl:"/views/start/login.html",controller:"LoginCtrl"}).state("menu",{url:"/menu",templateUrl:"/views/start/menu-screen.html",controller:"MenuScreenCtrl"}).state("contact",{url:"/contact",views:{"@":{templateUrl:"/views/default/app-structure.html"},"Header@contact":{templateUrl:"/views/default/header.html",controller:"HeaderContactCtrl"}}}).state("contact.entries",{url:"/entries",views:{"Content@contact":{templateUrl:"/views/contact/entries.html",controller:"ContactEntriesCtrl"}}}).state("password",{url:"/password",views:{"@":{templateUrl:"/views/default/app-structure.html"},"Header@password":{templateUrl:"/views/default/header.html",controller:"HeaderPasswordCtrl"}}}).state("password.entries",{url:"/entries",views:{"Content@password":{templateUrl:"/views/password/entries.html",controller:"PasswordEntriesCtrl"},"SlideOutMenu@password":{templateUrl:"/views/password/add-password.html",controller:"AddPasswordCtrl"}}}).state("calendar",{url:"/calendar",views:{"@":{templateUrl:"/views/default/app-structure.html"},"Header@calendar":{templateUrl:"/views/default/header.html",controller:"HeaderCalendarCtrl"}}}).state("calendar.basic",{url:"/basic",views:{"Content@calendar":{templateUrl:"/views/calendar/home.html",controller:"CalendarHomeCtrl"}}}).state("calendar.events",{url:"/events",views:{"Content@calendar":{templateUrl:"/views/calendar/events.html",controller:"CalendarEventsCtrl"}}}).state("calendar.timezone",{url:"/timezone",views:{"Content@calendar":{templateUrl:"/views/calendar/timezone.html",controller:"CalendarTimezoneCtrl"}}}),b.otherwise("/"),c.aHrefSanitizationWhitelist(/^\s*(https?|geo|javascript):/)}]).run(["$state","$stateParams","dictionary","slideOutMenuParams","gsDeviceListeners","$rootScope",function(a,b,c,d,e,f){f.$state=a,f.$stateParams=b,f.dictionary=c.read(),f.slideOutMenuParams=d,e.init(),f.$on("$device.backbutton",function(a){d.isSlideOpen&&(a.preventDefault(),a.defaultPrevented=!0,d.close(),f.$apply())})}]),angular.module("samsungEnterpriseApp").controller("LoginCtrl",["$scope",function(a){a.credentials={username:null,password:null},a.login=function(b){return a.error=!1,a.credentials.username&&a.credentials.username.toLowerCase().indexOf("samsung")>-1?(b&&b.target.blur(),!0):(a.error=!0,!1)},a.$on("$device.backbutton",function(a){a.defaultPrevented||navigator.app&&navigator.app.exitApp()})}]),angular.module("samsungEnterpriseApp").controller("MenuScreenCtrl",["$scope","$state","$timeout",function(a,b,c){a.menus=[],a.select=function(d){a.selected=!0,c(function(){b.go(d)},500)},c(function(){a.loaded=!0},500),a.$on("$device.backbutton",function(a){a.defaultPrevented||navigator.app&&navigator.app.exitApp()})}]),angular.module("samsungEnterpriseApp").factory("dictionary",function(){var a={login:{error:"Please login with your Samsung id"},contact:{header:{title:"Contact Management"}},password:{header:{title:"Password Vault"},master:{error:"Please enter the master password to open the vault"},add:{title:{error:"Please enter a title for password field"},password:{error:"The password and retype password did not match or empty"}}},calendar:{header:{title:"Enterprise Calendar"}}};return{read:function(){return a}}}),angular.module("samsungEnterpriseApp").controller("PasswordEntriesCtrl",["$scope","passwordManagerService","AppEventManager","$state",function(a,b,c,d){a.masterPassword=null,a.displayPassword=!1,a.check=function(c){a.error={},a.masterPassword?(c&&c.target.blur(),a.displayPassword=!0,b.get().then(function(b){a.passwordList=b})):a.error.master=!0},a.$on(c.password.added,function(c,d){d.password&&(a.passwordList=b.add(d.password))}),a.$on("$device.backbutton",function(a){a.defaultPrevented||d.go("menu")})}]),angular.module("samsungEnterpriseApp").factory("networkCallService",["AppConfig","$http","$q",function(a,b,c){function d(d){var e=c.defer(),f={},g={contacts:"internal-contacts",password:"password-list",events:"calendar-events",timezone:"calendar-timezone"};return!a.backend.enabled&&g[d]?f[d]?e.resolve(f[d]):b.get("./mock-data/"+g[d]+".json").success(function(a){e.resolve(a),f[d]=a}).error(function(a){e.reject(a)}):(e.reject("call rejected"),console.log("Network call rejected")),e.promise}return{call:function(a){return d(a)}}}]),angular.module("samsungEnterpriseApp").factory("passwordManagerService",["networkCallService","$q",function(a,b){var c;return{get:function(){var d=b.defer();return c?d.resolve(c):a.call("password").then(function(a){c=a.passwordList,d.resolve(c)}),d.promise},add:function(a){return c.push({title:a.title,password:a.password,id:a.id}),c}}}]),angular.module("samsungEnterpriseApp").filter("maskPassword",function(){return function(a,b){return b?"xxxxxx"+a.slice(-2):a}}),angular.module("samsungEnterpriseApp").factory("contactManagerService",["networkCallService","$q",function(a,b){var c;return{get:function(){var d=b.defer();return c?d.resolve(c):a.call("contacts").then(function(a){c=a.contacts,d.resolve(c)}),d.promise}}}]),angular.module("samsungEnterpriseApp").controller("ContactEntriesCtrl",["$scope","contactManagerService","$state","$timeout",function(a,b,c,d){b.get().then(function(b){d(function(){a.contacts=b})}),a.$on("$device.backbutton",function(a){a.defaultPrevented||c.go("menu")})}]),angular.module("samsungEnterpriseApp").directive("contactItem",function(){return{templateUrl:"/views/directives/contact-item.html",restrict:"E",replace:!0,scope:{contact:"="}}}),angular.module("samsungEnterpriseApp").directive("wallopSlider",function(){return{template:'<div ng-swipe-left="onNextButtonClicked()" ng-swipe-right="onPrevButtonClicked()" class="wallop-slider {{animationClass}}"><ul class="wallop-slider__list"><li class="wallop-slider__item {{itemClasses[$index]}}" ng-repeat="i in images"><img src="{{i}}"></li></ul></div>',restrict:"EA",transclude:!0,replace:!1,scope:{images:"=",animation:"@",currentItemIndex:"=",onNext:"&",onPrevious:"&"},controller:["$scope",function(a){function b(){return console.log("$scope.currentItemIndex",a.currentItemIndex,a.images.length),a.currentItemIndex+1===a.images.length}function c(){return!a.currentItemIndex}function d(){a.nextDisabled=b(),a.prevDisabled=c()}function e(){for(var b=0;b<a.images.length;b++)a.itemClasses[b]=""}function f(b){if(console.log("_goTo",b),b>=a.images.length||0>b||b===a.currentItemIndex)return void(b||(a.itemClasses[0]=g.currentItemClass));e(),a.itemClasses[a.currentItemIndex]=b>a.currentItemIndex?g.hidePreviousClass:g.hideNextClass;var c=b>a.currentItemIndex?g.showNextClass:g.showPreviousClass;a.itemClasses[b]=g.currentItemClass+" "+c,a.currentItemIndex=b,d()}a.itemClasses=[],a.$watch("images",function(a){a.length&&f(0)}),a.$watch("itemClasses",function(a){console.log("itemClasses",a)}),a.animation&&(a.animationClass="wallop-slider--"+a.animation);var g={btnPreviousClass:"wallop-slider__btn--previous",btnNextClass:"wallop-slider__btn--next",itemClass:"wallop-slider__item",currentItemClass:"wallop-slider__item--current",showPreviousClass:"wallop-slider__item--show-previous",showNextClass:"wallop-slider__item--show-next",hidePreviousClass:"wallop-slider__item--hide-previous",hideNextClass:"wallop-slider__item--hide-next"};a.onPrevButtonClicked=function(){f(a.currentItemIndex-1)},a.onNextButtonClicked=function(){f(a.currentItemIndex+1)},a.$watch("currentItemIndex",function(b,c){c>b?"function"==typeof a.onPrevious&&a.onPrevious():"function"==typeof a.onNext&&a.onNext()})}]}}),angular.module("samsungEnterpriseApp").controller("AddPasswordCtrl",["$scope","AppEventManager","$Tell",function(a,b,c){a.password={},a.add=function(d){return a.error={},d&&d.target.blur(),a.password.password&&a.password.title&&a.password.password===a.password.rePassword?(a.password.id=(new Date).getTime(),c.children("Password Block",b.password.added,{password:a.password}),a.password={},!0):a.password.title?(a.error.password=!0,!1):(a.error.title=!0,!1)}}]),angular.module("samsungEnterpriseApp").factory("AppEventManager",function(){return{password:{added:"event.password.added"}}}),angular.module("samsungEnterpriseApp").controller("HeaderContactCtrl",["$scope","$state","$rootScope",function(a,b,c){a.back=function(){b.go("menu")},a.title=c.dictionary.contact.header.title}]),angular.module("samsungEnterpriseApp").controller("HeaderPasswordCtrl",["$scope","$state","$rootScope",function(a,b,c){a.back=function(){b.go("menu")},a.title=c.dictionary.password.header.title}]),angular.module("samsungEnterpriseApp").controller("CalendarHomeCtrl",["$scope","$timeout",function(a,b){a.options=[],b(function(){a.options=[{label:"Calendar Events",icon:"calendar",state:"calendar.events"},{label:"Headquarters Timezone",icon:"globe",state:"calendar.timezone"}]})}]),angular.module("samsungEnterpriseApp").controller("HeaderCalendarCtrl",["$scope","$state","$rootScope",function(a,b,c){a.back=function(){switch(!0){case b.is("calendar.basic"):b.go("menu");break;default:b.go("calendar.basic")}},a.title=c.dictionary.calendar.header.title}]),angular.module("samsungEnterpriseApp").factory("calendarEventService",["networkCallService","$q",function(a,b){var c;return{get:function(){var d=b.defer();return c?d.resolve(c):a.call("events").then(function(a){c=a.events,d.resolve(c)}),d.promise}}}]),angular.module("samsungEnterpriseApp").controller("CalendarEventsCtrl",["$scope","calendarEventService","$state","$timeout",function(a,b,c,d){b.get().then(function(b){d(function(){a.events=b})}),a.$on("$device.backbutton",function(a){if(!a.defaultPrevented)switch(!0){case c.is("calendar.basic"):c.go("menu");break;default:c.go("calendar.basic")}})}]),angular.module("samsungEnterpriseApp").controller("CalendarTimezoneCtrl",["$scope","calendarTimezoneService","$state","$timeout",function(a,b,c,d){b.get().then(function(b){d(function(){a.timezones=b})}),a.$on("$device.backbutton",function(a){if(!a.defaultPrevented)switch(!0){case c.is("calendar.basic"):c.go("menu");break;default:c.go("calendar.basic")}})}]),angular.module("samsungEnterpriseApp").factory("calendarTimezoneService",["networkCallService","$q",function(a,b){var c;return{get:function(){var d=b.defer();return c?d.resolve(c):a.call("timezone").then(function(a){c=a.timezone,d.resolve(c)}),d.promise}}}]);