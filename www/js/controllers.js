"use strict";

angular
	.module("conFusion.controllers", [])
	.controller("AppCtrl", [
		"$scope",
		"$ionicModal",
		"$timeout",
		"$ionicPlatform",
		"userFactory",
		"$cordovaToast",
		function appCrtl(
			$scope,
			$ionicModal,
			$timeout,
			$ionicPlatform,
			userFactory,
			$cordovaToast
		) {

			// With the new view caching in Ionic, Controllers are only called
			// when they are recreated or on app start, instead of every page
			// change. To listen for when this page is active (for example, to
			// refresh data), listen for the $ionicView.enter event:
			// $scope.$on('$ionicView.enter', function(e) { });

			// login modal
			$scope.loginData = {
				username: userFactory.getName(),
				token   : userFactory.getToken(),
				password: ""
			};

			$ionicModal
				.fromTemplateUrl("templates/login.html", {
					scope: $scope
				})
				.then((modal) => {
					$scope.loginForm = modal;
				});

			$scope.closeLoginForm = () => $scope.loginForm.hide();

			$scope.openLoginForm = () => $scope.loginForm.show();

			$scope.doLogin = function doLogin() {
				userFactory
					.login($scope.loginData)
					.then(() => $scope.closeLoginForm())
					.catch(err => $cordovaToast.show(err, "long", "top"));
			};

			// table reservation
			$scope.reservation = {};

			$ionicModal
				.fromTemplateUrl("templates/reserve.html", {
					scope: $scope
				})
				.then(modal => {
					$scope.tableReservationForm = modal;
				});

			$scope.closeReservationForm = () => $scope.tableReservationForm.hide();

			$scope.openReservationForm = () => $scope.tableReservationForm.show();

			$scope.reserveTable = () => $timeout(
				() => $scope.closeReservationForm(),
				1000
			);

			// registration
			$scope.registration = {};

			$ionicModal
				.fromTemplateUrl("templates/register.html", {
					scope: $scope
				})
				.then(modal => {$scope.registrationForm = modal;});

			$scope.closeRegistrationForm = () => $scope.registrationForm.hide();

			$scope.openRegistrationForm = () => $scope.registrationForm.show();

			$scope.doRegister = function doRegister() {
				userFactory
					.register($scope.registration)
					.then(() => {
						$scope.closeRegistrationForm();
						$scope.registration = {};
					})
					.catch(err => $cordovaToast.show(err, "long", "top"));
			};
		}
	])
	.controller("MenuController", [
		"$scope",
		"dishes",
		"favoriteFactory",
		"baseURL",
		function menuController($scope, dishes, favoriteFactory, baseURL) {
			$scope.baseURL = baseURL;
			$scope.tab = 1;
			$scope.filtText = "";
			$scope.showDetails = false;
			$scope.dishes = dishes;

			$scope.select = function select(setTab) {
				$scope.tab = setTab;

				if (setTab === 2) {
					$scope.filtText = "appetizer";
				} else if (setTab === 3) {
					$scope.filtText = "mains";
				} else if (setTab === 4) {
					$scope.filtText = "dessert";
				} else {
					$scope.filtText = "";
				}
			};

			$scope.isSelected = (checkTab) => $scope.tab === checkTab;

			$scope.toggleDetails = () => {$scope.showDetails = !$scope.showDetails;};
		}
	])
	.controller("ContactController", [
		"$scope",
		function contactController($scope) {
			$scope.feedback = {
				mychannel: "",
				firstName: "",
				lastName : "",
				agree    : false,
				email    : ""
			};

			$scope.channels = [
				{
					value: "tel",
					label: "Tel."
				},
				{
					value: "Email",
					label: "Email"
				}
			];

			$scope.invalidChannelSelection = false;
		}
	])
	.controller("FeedbackController", [
		"$scope",
		"feedbackFactory",
		function feedbackController($scope, feedbackFactory) {

			$scope.sendFeedback = function sendFeedback() {

				if ($scope.feedback.agree && $scope.feedback.mychannel === "") {
					$scope.invalidChannelSelection = true;
				} else {
					$scope.invalidChannelSelection = false;

					feedbackFactory.save($scope.feedback);

					$scope.feedback = {
						mychannel: "",
						firstName: "",
						lastName : "",
						agree    : false,
						email    : ""
					};
					$scope.feedback.mychannel = "";
					$scope.feedbackForm.$setPristine();
				}
			};
		}
	])
	.controller("DishDetailController", [
		"$scope",
		"dish",
		"baseURL",
		"$ionicPopover",
		"$ionicModal",
		"$ionicBody",
		"favoriteFactory",
		"$ionicPlatform",
		"$cordovaLocalNotification",
		"$cordovaToast",
		"userFactory",
		function dishDetailController(
			$scope,
			dish,
			baseURL,
			$ionicPopover,
			$ionicModal,
			$ionicBody,
			favoriteFactory,
			$ionicPlatform,
			$cordovaLocalNotification,
			$cordovaToast,
			userFactory
		) {
			$scope.baseURL = baseURL;
			$scope.dish = dish;

			// Options popover setup
			$ionicPopover
				.fromTemplateUrl(
					"templates/dish-detail-popover.html",
					{scope: $scope}
				)
				.then(popover => { $scope.popover = popover;});

			$scope.showOptions = ($event) => $scope.popover.show($event);

			$scope.hideOptions = function hideOptions() {
				$scope.popover.hide();
				$ionicBody.removeClass("popover-open");
			};

			// Dish comment form modal setup
			$ionicModal
				.fromTemplateUrl(
					"templates/dish-comment.html",
					{scope: $scope}
				)
				.then(modal => {$scope.modal = modal;});

			$scope.showCommentForm = function showCommentForm($event) {
				if(!userFactory.isAuthenticated()){
				    return $cordovaToast.show('Please login', 'long', 'top');
				}

				$scope.modal.show($event);
				$scope.hideOptions();
			};

			$scope.hideCommentForm = () => $scope.modal.hide();

			$scope.addToFavorite = function addToFavorite(index) {
				if(!userFactory.isAuthenticated()){
				    return $cordovaToast.show('Please login', 'long', 'top');
				}

				favoriteFactory.addToFavorites(index);
				$scope.hideOptions();

				$ionicPlatform
					.ready(function onPlatformReady() {
						$cordovaLocalNotification.schedule({
							id   : 1,
							title: "Added Favorite",
							text : $scope.dish.name
						});

						$cordovaToast.show(
							"Added Favorite " + $scope.dish.name, "long",
							"bottom"
						);
					});
			};
		}
	])
	.controller("DishCommentController", [
		"$scope",
		"menuFactory",
		"userFactory",
		function dishCommentController($scope, menuFactory, userFactory) {
			$scope.mycomment = {rating: 5, comment: "", author: "", date: ""};

			$scope.submitComment = function submitComment() {
				$scope.mycomment.date = new Date().toISOString();
				$scope.mycomment.author = userFactory.getName();
				$scope.mycomment.postedBy = userFactory.getUserId();
				$scope.mycomment.token = userFactory.getToken();

				//$scope.dish.comments.push($scope.mycomment);
				menuFactory.update({id: $scope.dish.id}, $scope.dish);

				$scope.commentForm.$setPristine();
				$scope.mycomment = {
					rating : 5,
					comment: "",
					author : "",
					date   : ""
				};
				$scope.hideCommentForm();
			};
		}
	])
	.controller("IndexController", [
		"$scope",
		"dish",
		"promotion",
		"leader",
		"baseURL",
		function indexController($scope, dish, promotion, leader, baseURL) {
			$scope.baseURL = baseURL;
			$scope.leader = leader;
			$scope.dish = dish;
			$scope.promotion = promotion;
		}
	])
	.controller("AboutController", [
		"$scope",
		"leaders",
		"baseURL",
		function aboutController($scope, leaders, baseURL) {
			$scope.leaders = leaders;
			$scope.baseURL = baseURL;
		}
	])
	.controller("FavoritesController", [
		"$scope",
		"favorites",
		"baseURL",
		"$ionicPopup",
		"favoriteFactory",
		"$cordovaVibration",
		"$ionicPlatform",
		function favoritesController(
			$scope,
			favorites,
			baseURL,
			$ionicPopup,
			favoriteFactory,
			$cordovaVibration,
			$ionicPlatform
		) {
			$scope.baseURL = baseURL;
			$scope.favorites = favorites;

			$scope.shouldShowDelete = false;
			$scope.toggleDelete = () => {$scope.shouldShowDelete = !$scope.shouldShowDelete;};

			$scope.deleteFavorite = function deleteFavorite(index) {
				$ionicPopup
					.confirm({
						title   : "Confirm Delete",
						template: "Are you sure you want to delete this item?"
					})
					.then(res => {
						if (res) {
							favoriteFactory
								.deleteFromFavorites(index);

							$ionicPlatform
								.ready(() => $cordovaVibration.vibrate(1000));
						}
					});

				$scope.shouldShowDelete = false;
			};
		}
	]);
