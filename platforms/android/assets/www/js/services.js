'use strict';

angular
	.module("conFusion.services", ["ngResource"])

	.constant(
		"baseURL",
		"http://confusion-vangel-hristov.herokuapp.com/"
		/*"http://localhost:8100/"*/
	)

	.factory("menuFactory", [
		"$resource",
		"baseURL",
		($resource, baseURL) => $resource(
			baseURL + "api/dishes/:id",
			null,
			{
				update: {
					method: "PUT"
				}
			}
		)
	])

	.factory("promotionFactory", [
		"$resource",
		"baseURL",
		($resource, baseURL) => $resource(baseURL + "api/promotions/:id")
	])

	.factory("corporateFactory", [
		"$resource",
		"baseURL",
		($resource, baseURL) => $resource(baseURL + "api/leadership/:id")
	])

	.factory("feedbackFactory", [
		"$resource",
		"baseURL",
		($resource, baseURL) => $resource(baseURL + "api/feedback/:id")
	])

	.factory("favoriteFactory", [
		"$resource",
		"baseURL",
		"userFactory",
		function favoriteFactory($resource, baseURL, userFactory) {

			let addToFavorites = function (id) {
				return $resource(baseURL + 'api/favorites')
					.save({
						token: userFactory.getToken(),
						id   : id
					})
					.$promise
					.then(favorites => favorites.dishes)
					.catch(err => err);
			};

			let deleteFromFavorites = function (id) {
				return $resource(
					baseURL + 'api/favorites/:id',
					{id: '@id'},
					{
						deleteFromFavorites: {
							method : 'DELETE',
							headers: {'x-access-token': userFactory.getToken()}
						}
					}
				)
					.deleteFromFavorites({id: id})
					.$promise
					.then(favorites => favorites)
					.catch(err => err);
			};

			let getFavorites = function () {
				return $resource(
					baseURL + 'api/favorites',
					{},
					{
						getFavorites: {
							method : 'GET',
							headers: {'x-access-token': userFactory.getToken()}
						}
					}
				)
					.getFavorites()
					.$promise
					.then(favorites => favorites.dishes)
					.catch(err => err);
			};

			return {
				addToFavorites,
				deleteFromFavorites,
				getFavorites
			};
		}
	])

	.factory('userFactory', [
		'$window',
		'$resource',
		'baseURL',
		function userFactory($window, $resource, baseURL) {
			const id = '234781390h-fdggh034875-348dsuijkh-f07156-318-0';
			const name = '276fdibhjdsnhgfm5432-90y8fb43j5k87452bh387gr213h';
			const token = 'nbqrncr0754yv8b0f7n8723816r2t87ungi35370h98876cb3';
			const url = baseURL + 'api/users/';

			const storeUser = function (user) {
				$window.localStorage.setItem(id, user.userId);
				$window.localStorage.setItem(name, user.name);
				$window.localStorage.setItem(token, user.token);
			};

			const removeUser = function () {
				$window.localStorage.removeItem(id);
				$window.localStorage.removeItem(name);
				$window.localStorage.removeItem(token);
			};

			return {
				register       : function (user) {
					return $resource(url + 'register')
						.save(user)
						.$promise
						.then(result => storeUser(result))
						.catch(err => err);
				},
				login          : function (user) {
					return $resource(url + 'login')
						.save(user)
						.$promise
						.then(result => {storeUser(result);})
						.catch(err => err);
				},
				logout         : function () {
					return $resource(url + 'logout')
						.get()
						.$promise
						.then(() => removeUser())
						.catch(err => err);
				},
				getName        : () => $window.localStorage.getItem(name),
				getUserId      : () => $window.localStorage.getItem(id),
				getToken       : () => $window.localStorage.getItem(token),
				isAuthenticated: () => $window.localStorage.getItem(token) !== null
			};
		}
	]);
