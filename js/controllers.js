/**
 * Main Controller
 */
function MainAppCtrl( $scope, $location, UserService, JsonService ){
	
	// Change path when link is "touched"
	$scope.link = function(link) {
		$location.path(link);
	}

	console.log(UserService.isLogged());
}

/**
 * Login Controller
 */
function LoginCtrl($scope, UserService, $location) {
	
	// Function to redirect to home page when connected
	$scope.loggedOn = function() {
		if(UserService.isLogged()){
			$location.path('/');
		}
	}

	// Check if user is already connected
	$scope.loggedOn();
	
	// Log user in and store user informations
	$scope.login = function(user) {
		UserService.username = $scope.user.name;
		UserService.password = $scope.user.password;
		UserService.login($scope.user.name, $scope.user.password);
		$scope.loggedOn();
	}

	$scope.logout = function() {
		UserService.logout();
	}
}

/**
 * Logout Controller
 */
function LogoutCtrl($scope, UserService, $location) {

	$scope.logOut = function() {
		UserService.logout();
		$location.path('login');
	}

	// Check if user is already connected
	$scope.logOut();
}

/**
 * Checklist Controller
 */
function ChecklistCtrl($scope) {

	$scope.todos = [
    {text:'I should do this', done:true},
    {text:'I should also do this', done:false}
    ];

    // Calculate the number of remaining elements to check
    $scope.remaining = function() {
    	var count = 0;
	    angular.forEach($scope.todos, function(todo) {
	      count += todo.done ? 0 : 1;
	    });
	    return count;
    }

    // Un-check all elements
    $scope.uncheck = function() {
    	angular.forEach($scope.todos, function(todo) {
	      if(todo.done)
	      	todo.done = false;
	    });
    }
}

/**
 * Side Bar Controller
 */
function SidebarCtrl($scope, JsonService) {
	JsonService.query({controller:'taxonomy', action:'get_terms', taxonomy:'category'}, function(res) {
		$scope.categories = res;
		// Delete "status: ok" entry
		delete $scope.categories.status;
	});
}

/**
 * Posts Controller
 */
function PostCtrl($scope, JsonService, $routeParams, UserService) {
	$scope.cat = $routeParams.category;

	JsonService.query({controller:'core_auth', action:'get_posts', cat:$scope.cat}, function(res) {
		$scope.posts = res;
	});

	$scope.info = encodeURIComponent(UserService.getCookie());
}