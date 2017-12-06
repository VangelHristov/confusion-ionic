angular
	.module("conFusion.controllers", [])
	.controller("AppCtrl", [
		"$scope",
		"$ionicModal",
		"$timeout",
		"$localStorage",
		"$ionicPlatform",
		"userFactory",
		"$cordovaCamera",
		"$cordovaImagePicker",
		function (
			$scope,
			$ionicModal,
			$timeout,
			$localStorage,
			$ionicPlatform,
			userFactory,
			$cordovaCamera,
			$cordovaImagePicker
		) {
			"use strict";

			// With the new view caching in Ionic, Controllers are only called
			// when they are recreated or on app start, instead of every page
			// change. To listen for when this page is active (for example, to
			// refresh data), listen for the $ionicView.enter event:
			// $scope.$on('$ionicView.enter', function(e) { });

			// login modal
			$scope.loginData = $localStorage.getObject("userinfo", "{}");

			$ionicModal
				.fromTemplateUrl("templates/login.html", {
					scope: $scope
				})
				.then(function (modal) {
					$scope.loginForm = modal;
				});

			$scope.closeLoginForm = function () {
				$scope.loginForm.hide();
			};

			$scope.openLoginForm = function () {
				$scope.loginForm.show();
			};

			$scope.doLogin = function () {
				//$localStorage.storeObject("userinfo", $scope.loginData);

				userFactory
					.login($scope.loginData)
					.then(() => $scope.closeLoginForm())
					.catch(err => {});
			};

			// table reservation
			$scope.reservation = {};

			$ionicModal
				.fromTemplateUrl("templates/reserve.html", {
					scope: $scope
				})
				.then(function (modal) {
					$scope.tableReservationForm = modal;
				});

			$scope.closeReservationForm = function () {
				$scope.tableReservationForm.hide();
			};

			$scope.openReservationForm = function () {
				$scope.tableReservationForm.show();
			};

			$scope.reserveTable = function () {
				$timeout(function () {
					$scope.closeReservationForm();
				}, 1000);
			};

			// registration
			$scope.registration = {};

			$ionicModal
				.fromTemplateUrl("templates/register.html", {
					scope: $scope
				})
				.then(function (modal) {
					$scope.registrationForm = modal;
				});

			$scope.closeRegistrationForm = function () {
				$scope.registrationForm.hide();
			};

			$scope.openRegistrationForm = function () {
				$scope.registrationForm.show();
			};

			$scope.doRegister = function () {
				userFactory
					.register($scope.registration)
					.then(() => $scope.closeRegistrationForm())
					.catch(err => {});
			};

			$ionicPlatform.ready(function () {
				var options = {
					quality         : 100,
					destinationType : Camera.DestinationType.DATA_URL,
					sourceType      : Camera.PictureSourceType.CAMERA,
					allowEdit       : true,
					encodingType    : Camera.EncodingType.JPEG,
					targetWidth     : 100,
					targetHeight    : 100,
					popoverOptions  : CameraPopoverOptions,
					saveToPhotoAlbum: false
				};

				$scope.takePicture = function () {
					$cordovaCamera.getPicture(options)
					              .then(
						              function (imageData) {
							              $scope.registration.imgSrc =
								              "data:image/jpeg;base64," + imageData;
						              }, function (err) { console.log(err); });

					$scope.openRegistrationForm();
				};
			});

			// open gallery
			$scope.openGallery = function () {
				$cordovaImagePicker
					.getPictures({
						maximumImagesCount: 1,
						width             : 100,
						height            : 100,
						quality           : 50
					})
					.then(function (results) {
						$scope.registration.imgSrc = results[0];
					})
					.catch(function (err) {
						console.log(err);
					});

				$scope.openRegistrationForm();
			};
		}
	])
	.controller("MenuController", [
		"$scope",
		"dishes",
		"favoriteFactory",
		"baseURL",
		function ($scope, dishes, favoriteFactory, baseURL) {
			$scope.baseURL = baseURL;
			$scope.tab = 1;
			$scope.filtText = "";
			$scope.showDetails = false;
			$scope.dishes = dishes;

			$scope.select = function (setTab) {
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

			$scope.isSelected = function (checkTab) {
				return $scope.tab === checkTab;
			};

			$scope.toggleDetails = function () {
				$scope.showDetails = !$scope.showDetails;
			};
		}
	])
	.controller("ContactController", [
		"$scope",
		function ($scope) {
			$scope.feedback = {
				mychannel: "",
				firstName: "",
				lastName : "",
				agree    : false,
				email    : ""
			};

			var channels = [
				{
					value: "tel",
					label: "Tel."
				},
				{
					value: "Email",
					label: "Email"
				}
			];

			$scope.channels = channels;
			$scope.invalidChannelSelection = false;
		}
	])
	.controller("FeedbackController", [
		"$scope",
		"feedbackFactory",
		function ($scope, feedbackFactory) {
			$scope.sendFeedback = function () {
				if ($scope.feedback.agree && $scope.feedback.mychannel == "") {
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
		function (
			$scope,
			dish,
			baseURL,
			$ionicPopover,
			$ionicModal,
			$ionicBody,
			favoriteFactory,
			$ionicPlatform,
			$cordovaLocalNotification,
			$cordovaToast
		) {
			$scope.baseURL = baseURL;
			$scope.dish = dish;

			// Options popover setup
			$ionicPopover.fromTemplateUrl(
				"templates/dish-detail-popover.html",
				{scope: $scope}
			             )
			             .then(function (popover) {
				             $scope.popover = popover;
			             });

			$scope.showOptions = function ($event) {
				$scope.popover.show($event);
			};

			$scope.hideOptions = function () {
				$scope.popover.hide();
				$ionicBody.removeClass("popover-open");
			};

			// Dish comment form modal setup
			$ionicModal.fromTemplateUrl(
				"templates/dish-comment.html",
				{scope: $scope}
			           )
			           .then(function (modal) {
				           $scope.modal = modal;
			           });

			$scope.showCommentForm = function ($event) {
				$scope.modal.show($event);
				$scope.hideOptions();
			};

			$scope.hideCommentForm = function () {
				$scope.modal.hide();
			};

			$scope.addToFavorite = function (index) {
				favoriteFactory.addToFavorites(index);
				$scope.hideOptions();

				$ionicPlatform.ready(function () {
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
		function ($scope, menuFactory, userFactory) {
			$scope.mycomment = {rating: 5, comment: "", author: "", date: ""};

			$scope.submitComment = function () {
				$scope.mycomment.date = new Date().toISOString();
				$scope.mycomment.author = userFactory.getName();
				$scope.mycomment.postedBy = userFactory.getUserId();
				$scope.mycomment.token = userFactory.getToken();

				$scope.dish.comments.push($scope.mycomment);
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
		function ($scope, dish, promotion, leader, baseURL) {
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
		function ($scope, leaders, baseURL) {
			$scope.leaders = leaders;
			$scope.baseURL = baseURL;
		}
	])
	.controller("FavoritesController", [
		"$scope",
		"dishes",
		"favorites",
		"baseURL",
		"$ionicPopup",
		"favoriteFactory",
		"$cordovaVibration",
		"$ionicPlatform",
		function (
			$scope,
			dishes,
			favorites,
			baseURL,
			$ionicPopup,
			favoriteFactory,
			$cordovaVibration,
			$ionicPlatform
		) {
			$scope.baseURL = baseURL;
			$scope.favorites = favorites;
			$scope.dishes = dishes;

			$scope.shouldShowDelete = false;
			$scope.toggleDelete = function () {
				$scope.shouldShowDelete = !$scope.shouldShowDelete;
			};

			$scope.deleteFavorite = function (index) {
				$ionicPopup
					.confirm({
						title   : "Confirm Delete",
						template: "Are you sure you want to delete this item?"
					})
					.then(function (res) {
						if (res) {
							favoriteFactory.deleteFromFavorites(index);

							$ionicPlatform.ready(function () {
								$cordovaVibration.vibrate(1000);
							});
						}
					});

				$scope.shouldShowDelete = false;
			};
		}
	]);
