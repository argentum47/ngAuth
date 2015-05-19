# ngAuth
angular directive for facebook and google and others


These are simple providerseach written in a separate module, like ngFacebook and ngGoogle .

Inclde them like:

```
angular
  .module('someApp', [
      'ngFacebook',
      'ngGoogle'
    ])
    .config(function($googleProvider, $facebookProvider) {
      $googleProvider.setClientId("").setPermissions([])
      $facebookProvider.setAppId("").setCustomeConfig({status: true}).setPermissions([])
    });
  ```
  
  Looking forwad to adding other providers , and combining them into one, if possible. 
  
  __PR's are accepted__
