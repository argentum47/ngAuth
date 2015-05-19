(function () {
  angular
      .module('ngFacebook',[])
      .provider('$facebook', function () {
        var config = {
          permissions: 'email',
          version: 'v2.3',
          appId: null,
          custom: {
            status: true,
            xfbml: false
          }
        };

        this.setAppId = function (appId) {
            config.appId = appId;
            return this;
          };

        this.setCustomConfig = function (config) {
            config.custom = config;
            return this;
          };

          this.setPermissions = function (permissions) {
            if(Array.isArray(permissions))
              permissions = permissions.join(", ");
            config.permissions = permissions;
            return this;
          }

        this.$get = [
            '$q',
            '$rootScope',
            '$window',
            function ($q, $rootScope, $window) {
              var $facebook = $q.defer(),
                  isLoggedIn = false,
                  firstAuthResolved = false,
                  firstAuthResp = $q.defer(),
                  events = ['auth.login', 'auth.logout','auth.authResponseChange'];

              $facebook.config = function (prop) {
                return config[prop]
              };

              $facebook.init = function () {
                if($facebook.config("appId") == null)
                  throw "Your App needs an id";

                $window.FB.init(
                    angular.extend({ appId: $facebook.config("appId"), version: $facebook.config("version") }, $facebook.config("custom"))
                );

                $rootScope.$broadcast('fb.load', $window.FB);
              };

              $rootScope.$on("fb.load", function (e, FB) {
                $facebook.resolve(FB);
                angular.forEach(events, function(event) {
                  FB.Event.subscribe(event, function (response) {
                    $rootScope.$broadcast("fb." + event, response, FB);
                  })
                });

                $facebook.getLoginStatus();
              });

              $rootScope.$on('fb.auth.authResponse', function (_e, response, FB) {
                console.log("status change initiated..")
                if(response.status == "connected")
                  isLoggedIn = true;
                else
                  isLoggedIn = false;

                if(!firstAuthResolved) {
                  firstAuthResolved = true;
                  firstAuthResp.resolve(FB);
                }
              });

              $facebook.getLoginStatus = function(force) {
                var d = $q.defer();

                return $facebook.promise.then( function(FB) {
                  FB.getLoginStatus(function (response) {
                    if(response.error)  d.reject(response);

                    else {
                      d.resolve(response);

                      if(!isLoggedIn)
                        $rootScope.$broadcast('fb.auth.authResponse', response, FB)
                    }

                  }, force);

                  return d.promise;
                });
              };

              $facebook.login = function (permissions, rerequest) {
                var d = $q.defer(),
                    options = {};
                if(permissions === undefined) permissions = $facebook.config("permissions");

                options.scope = permissions;
                if(rerequest) options.auth_type = "rerequest";

                return $facebook.promise.then(function (FB) {
                  FB.login(function (response) {
                    if(response.error)  d.reject(response.error)
                    else d.resolve(response);
                  }, options);

                  return d.promise;
                });
              };

              $facebook.api = function () {
                var d = $q.defer();
                var args = arguments;
                args[args.length++] = function (response) {
                  if(response.error)  d.reject(response.error);
                  else  d.resolve(response)
                };

                return firstAuthResp.promise.then(function(FB) {
                  FB.api.apply(FB, args);
                  return d.promise;
                });
              };
              return $facebook;
            }
        ]
      })
      .run(['$rootScope', '$window', '$facebook', function($rootScope, $window, $facebook) {
        $window.fbAsyncInit = function() {
          $facebook.init();
        };
      }])
})();
