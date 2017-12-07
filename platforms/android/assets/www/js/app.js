'use strict';

angular
	.module(
		"conFusion",
		[
			"ionic",
			"ngCordova",
			"conFusion.controllers",
			"conFusion.services"
		]
	)

	.run(function appRun(
		$ionicPlatform,
		$rootScope,
		$ionicLoading,
		$cordovaSplashscreen,
		$timeout
	) {
		$ionicPlatform.ready(function onPlatformReady() {
			// Hide the accessory bar by default (remove this to show the
			// accessory bar above the keyboard for form inputs)
			if (window.cordova && window.cordova.plugins.Keyboard) {
				window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				window.cordova.plugins.Keyboard.disableScroll(true);
			}
			if (window.StatusBar) {
				// org.apache.cordova.statusbar required
				window.StatusBar.styleDefault();
			}

			$timeout(
				() => $cordovaSplashscreen.hide(),
				2000
			);
		});

		$rootScope.$on("$stateChangeStart", () => {
			$ionicLoading.show({
				template: "<ion-spinner></ion-spinner> Loading ..."
			});
		});

		$rootScope.$on("$stateChangeSuccess", () => $ionicLoading.hide());
	})

	.config(function config($stateProvider, $urlRouterProvider) {

		$stateProvider

			.state("app", {
				url        : "/app",
				abstract   : true,
				templateUrl: "templates/sidebar.html",
				controller : "AppCtrl"
			})

			.state("app.home", {
				url  : "/home",
				views: {
					mainContent: {
						templateUrl: "templates/home.html",
						controller : "IndexController",
						resolve    : {
							dish     : [
								"menuFactory",
								menuFactory => menuFactory
									.get({id: "5a2137fef36d282c8c62e41d"})
							],
							promotion: [
								"promotionFactory",
								promotionFactory => promotionFactory
									.get({id: "5a213890f36d282c8c62e453"})
							],
							leader   : [
								"corporateFactory",
								corporateFactory => corporateFactory
									.get({id: "5a2138fcf36d282c8c62e473"})
							]
						}
					}
				}
			})

			.state("app.aboutus", {
				url  : "/aboutus",
				views: {
					mainContent: {
						templateUrl: "templates/aboutus.html",
						controller : "AboutController",
						resolve    : {
							leaders: [
								"corporateFactory",
								corporateFactory => corporateFactory.query()
							]
						}
					}
				}
			})

			.state("app.contactus", {
				url  : "/contactus",
				views: {
					mainContent: {
						templateUrl: "templates/contactus.html"
					}
				}
			})

			.state("app.menu", {
				url  : "/menu",
				views: {
					mainContent: {
						templateUrl: "templates/menu.html",
						controller : "MenuController",
						resolve    : {
							dishes: [
								"menuFactory",
								menuFactory => menuFactory.query()
							]
						}
					}
				}
			})

			.state("app.dishdetails", {
				url  : "/menu/:id",
				views: {
					mainContent: {
						templateUrl: "templates/dishdetail.html",
						controller : "DishDetailController",
						resolve    : {
							dish: [
								"$stateParams",
								"menuFactory",
								($stateParams, menuFactory) => menuFactory
									.get({id: $stateParams.id})
							]
						}
					}
				}
			})

			.state("app.favorites", {
				url  : "/favorites",
				views: {
					mainContent: {
						templateUrl: "templates/favorites.html",
						controller : "FavoritesController",
						resolve    : {
							favorites: [
								"favoriteFactory",
								favoriteFactory => favoriteFactory.getFavorites()
							]
						}
					}
				}
			});

		// if none of the above states are matched, use this as the fallback
		$urlRouterProvider.otherwise("/app/home");
	});
