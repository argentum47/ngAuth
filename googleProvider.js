(function () {
  angular
      .module('ngGoogle', [])
      .provider('$google', function () {
        var config = {
          permissions: 'email',
          clientId: null
        };

        this.setClientId = function(clientId) {
          config.clientId = clientId;
          return this;
        };

        this.setPermissions = function(permissions) {
          if(Array.isArray(permissions))
            permissions = permissions.join(' ');

          config.permissions = permissions;
          return this
        };

        this.$get = ['$q',
          '$rootScope',
          '$window',
          '$timeout',
          function($q, $rootScope, $window, $timeout) {
            var $google = $q.defer();

            $google.config = function (property) {
              return config[property];
            };

            $google.init = function () {
              $google.resolve($window.gapi);
            };

            $google.authorize = function () {
              var deferred = $q.defer();

              if ($google.config("clientId") == null)
                throw "Authentication failure, client id is missing";

              return $google.promise.then(function (gapi) {
                gapi.auth.authorize({
                    client_id: $google.config("clientId"),
                    scope: $google.config("permissions"),
                    immediate: false
                  },
                  function (response) {
                    if (response.error) deferred.reject(response.error)
                    else deferred.resolve(response)
                  });

                return deferred.promise;
              });
            };

            $google.me = function() {
              var deferred = $q.defer();

              return $google.promise.then(function(gapi) {
                gapi.client.load('oauth2', 'v2', function() {
                  gapi.client.oauth2.userinfo.get()
                    .execute(function(response) {
                      if(response.error) deferred.reject(response.error)
                      else deferred.resolve(response)
                    });
                  });

                return deferred.promise;
              });
            };

            return $google;
          }];
      }).run(['$window', '$google', function ($window, $google) {
        $window.googleAsync = function () {
          $google.init();
        }
      }])
})();
