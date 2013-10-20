var app = angular.module('bfc', ['ngTouch', 'ngRoute', 'ngCookies', 'ngResource', 'ngStorage']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    	when('/', {templateUrl: 'partials/home.html', controller: MainAppCtrl}).
    	when('/list/:category', {templateUrl: 'partials/list.html', controller: PostCtrl}).
    	when('/checklist', {templateUrl: 'partials/checklist.html', controller: ChecklistCtrl}).
    	when('/login', {templateUrl: 'partials/login.html', controller: LoginCtrl}).
    	when('/logout', {templateUrl: 'partials/login.html', controller: LogoutCtrl}).
    	otherwise({redirectTo: '/'});
    }])
    .run(function($rootScope, UserService, $location){
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
        	if(!UserService.isLogged()){
        		if (next.templateUrl == "partials/login.html") {
                // already going to the login route, no redirect needed
            	} else {
        			$location.path('/login');
        		}
        	}
        });
        
    });