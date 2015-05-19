'use strict';

angular
    .module('greetingsApp', [
      'ngResource',
      'ngRoute',
      'ngGoogle'
    ])
    .config(['$facebookProvider',
      '$googleProvider',
      function ($facebookProvider, $googleProvider) {
        $facebookProvider
          .setAppId('1234567890')
          .setPermissions(["email"])
        $googleProvider.setClientId("127382116586");
      }])
    .run(function ($window) {
      (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));

      (function(d, s, id) {
        var a = d.createElement(s),
            b = d.getElementsByTagName(s)[0];
        a.type = "text/javascript";
        a.id = id;
        a.src = "https://apis.google.com/js/client.js";
        b.parentNode.insertBefore(a, b);
        a.onload = $window.googleAsync;
      }(document, 'script', 'google-jssdk'));
    });
