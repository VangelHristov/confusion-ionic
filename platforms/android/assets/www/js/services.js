angular
	.module("conFusion.services", ["ngResource"])
	.constant("baseURL", "http://confusion-vangel-hristov.herokuapp.com/api/")
	.factory("$localStorage", [
		"$window",
		function ($window) {
			return {
				store      : function (key, value) {
					$window.localStorage[key] = value;
				},
				get        : function (key, defaultValue) {
					return $window.localStorage[key] || defaultValue;
				},
				storeObject: function (key, value) {
					$window.localStorage[key] = JSON.stringify(value);
				},
				getObject  : function (key, defaultValue) {
					return JSON.parse($window.localStorage[key] || defaultValue);
				}
			};
		}
	])
	.factory("menuFactory", [
		"$resource",
		"baseURL",
		function ($resource, baseURL) {
			return $resource(baseURL + "dishes/:id", null, {
				update: {
					method: "PUT"
				}
			});
		}
	])
	.factory("promotionFactory", [
		"$resource",
		"baseURL",
		function ($resource, baseURL) {
			return $resource(baseURL + "promotions/:id");
		}
	])
	.factory("corporateFactory", [
		"$resource",
		"baseURL",
		function ($resource, baseURL) {
			return $resource(baseURL + "leadership/:id");
		}
	])
	.factory("feedbackFactory", [
		"$resource",
		"baseURL",
		function ($resource, baseURL) {
			return $resource(baseURL + "feedback/:id");
		}
	])
	.factory("favoriteFactory", [
		"$resource",
		"baseURL",
		"$localStorage",
		function ($resource, baseURL, $localStorage) {
			var favFac = {};
			var favoriteDishesKey = "userFavoritesDishes";
			var favorites = $localStorage.getObject(favoriteDishesKey, "[]");

			favFac.addToFavorites = function (index) {
				for (var i = 0; i < favorites.length; i++) {
					if (favorites[i].id == index) return;
				}
				favorites.push({id: index});
				$localStorage.storeObject(favoriteDishesKey, favorites);
			};

			favFac.deleteFromFavorites = function (index) {
				for (var i = 0; i < favorites.length; i++) {
					if (favorites[i].id == index) {
						favorites.splice(i, 1);
					}
				}

				$localStorage.storeObject(favoriteDishesKey, favorites);
			};

			favFac.getFavorites = function () {
				return favorites;
			};

			return favFac;
		}
	])
	.filter("favoriteFilter", function () {
		return function (dishes, favorites) {
			var out = [];
			for (var i = 0; i < favorites.length; i++) {
				for (var j = 0; j < dishes.length; j++) {
					if (dishes[j].id === favorites[i].id) out.push(dishes[j]);
				}
			}
			return out;
		};
	})
	.factory('userFactory', [
		'$window',
		'$resource',
		'baseURL',
		function userFactory($window, $resource, baseURL) {
			const id = '234781390h-fdggh034875-348dsuijkh-f07156-318-0';
			const name = '276fdibhjdsnhgfm5432-90y8fb43j5k87452bh387gr213h';
			const token = 'nbqrncr0754yv8b0f7n8723816r2t87ungi35370h98876cb3';
			const url = baseURL + 'users/';

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
				register : function (user) {
					return $resource(url + 'register')
						.save(user)
						.$promise
						.then((result) => {
							storeUser(result);
							return;
						})
						.catch(err => err);
				},
				login    : function (user) {
					return $resource(url + 'login')
						.save(user)
						.$promise
						.then((result) => {
							storeUser(result);
							return;
						})
						.catch(err => err);
				},
				logout   : function () {
					return $resource(url + 'logout')
						.get()
						.$promise
						.then(() => {
							return;
						})
						.catch(err => err);
				},
				getName  : () => $window.localStorage.getItem(name),
				getUserId: () => $window.localStorage.getItem(id),
				getToken : () => $window.localStorage.getItem(token)
			};
		}
	]);
