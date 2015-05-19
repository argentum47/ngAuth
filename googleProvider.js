(function () {
  angular
      .module('ngGoogle', [])
      .provider('$google', function () {
        var config = {
          permissions: ' https://www.googleapis.com/auth/userinfo.email',
          clientId: null
        };

        /* this.setClientSecret = function(apiKey) {
         config.setApiKey = apiKey;
         return this;
         };
         */

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
              console.log($window.gapi, 1)
            };

            $google.authorize = function () {
              var deferred = $q.defer();

              if ($google.config("clientId") == null)
                throw "Authentication failure, client id is missing";

              return $google.promise.then(function (gapi) {
                gapi.auth.authorize({client_id: $google.config("clientId"),
                  scope: $google.config("permissions"), immediate: true},
                    function (response) {
                      if (response.error) deferred.reject(response.error)
                      else deferred.resolve(response)
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