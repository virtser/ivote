# Description

iVote gives you the opportunity to check how your friends are voting in upcoming elections. It doesn't matter which political views you have. The application is completely anonymous and it is not biased by any political movement.

The goal of the application is to help you decide which party to give your vote. By seeing how your friends (and friends of friends), after connecting with your Facebook account, has voted in total. Your friends can influence you to change your mind by posting in social feeds.

Blog post about the project and how we did it can be found here: https://medium.com/@virtser/ivote-b2d28461ac34

# General info

The application was built using:
- [Ruby on Rails](http://rubyonrails.org) for server side API and ORM management.
- [Ionic framework](http://ionicframework.com) + [AngularJS](https://angularjs.org) for client side development.
- [Cordova](https://cordova.apache.org) for native mobile support and packaging web app for Android and iOS.

The following services were used:
- [Facebook API](https://developers.facebook.com/docs/graph-api/) to signup/signing.
- [Mixpanel](https://mixpanel.com) for events tracking.
- [Mandrill](https://mandrill.com) for email notifications.
- [Pushwoosh](https://www.pushwoosh.com) for mobile push notifications.
- [Stream](http://getstream.io) for social feeds.
- [Heroku](https://www.heroku.com) as cloud application platform.


# Installation

## Web client

I will explain the workflow here, but please feel free to contact me if you have questions!

1. You need Ruby '2.1.2', Rails '4.1.6' and Node '0.10.25' to be installed on your machine.

2. Clone this repository 'master' branch. We were working in [feature branch methodology](http://nvie.com/posts/a-successful-git-branching-model/) aka git flow.

3.  Run *[first_time_install.sh](https://github.com/virtser/ivote/blob/master/first_time_install.sh)* script from the root directory to install rails, database, ionic and all its dependencies (cordova, bower, gulp). I assume that you have Node.js and Ruby installed. 

ionic/angular client is now incorporated into rails app.
It is sitting in the *client/* directory including environment for client development.

4. Once installed, you can use from *client/* directory *ionic serve* command to work locally on client including livereload. You need to execute *rails s* command also to run the server and have it proxied to ionic client development using [Gulp](http://gulpjs.com/).

5. All APIs are under */api/* scope in rails app.

6. *[build_client.sh](https://github.com/virtser/ivote/blob/master/build_client.sh)* script in the root to compile ionic app and copy it to Rails *pubic/* directory for later deployment.

7. Deploy to heroku as usual *git push heroku name_of_branch:master*.


## Native mobile

To setup build for native, do these steps:

* Remove the facebook connect plugin to prevent errors when adding platforms:

``` ionic plugin remove com.phonegap.plugins.facebookconnect ```

* Now add pltforms:

```
ionic platform add android
ionic platform add ios
```

* Add the facebook connect plugin back:

``` 
cordova -d plugin add https://github.com/Wizcorp/phonegap-facebook-plugin.git --variable APP_ID="1557020157879112" --variable APP_NAME="iVote" 
```

* Now you should be able to build:

```
ionic build ios
ionic build android
```

Note: why is the facebook plugin part of the repo in the first place if we remove and add?
The reason is for web facebook login we want it in, but when moving to mobile, if its in and you do a platform add, you will get an error as APP_ID and APP_NAME are not set, this error prevents all plugins from being added.


Before building a release version, the console plugin should be removed:
``` ionic plugin rm org.apache.cordova.console ```

then, build a release version:
``` ionic build --release android ```

to sign the jar type:
``` jarsigner -verbose -sigalg XXXXXXXXXX -digestalg SHA1 -keystore my-release-key.keystore platforms/android/ant-build/CordovaApp-release-unsigned.apk alias_name ```

finally use zipalign:

``` zipalign -f -v 4 platforms/android/ant-build/CordovaApp-release-unsigned.apk platforms/android/ant-build/CordovaApp-release-aligned.apk ```

(if zipalign is not found, you may need to copy it from Android SDK build-tool/<version>/zipalign to Android SDK tools/zipalign)

The resulting aligned APK can be uploaded to Google Play.

Shortcut: 
We made a *[build_android.sh](https://github.com/virtser/ivote/blob/master/client/build_android.sh)* script for the above 3 steps for building an apk for release to Google Play
you can use that. Make sure to increment android-versionCode in *config.xml* before uploading to Google Play. You may also update the version name.

For testing locally with Genymotion you need to reference the local server like that:
``` .value('ApiEndpoint', 'http://192.168.56.1:3000/api') ```

(note the 192.168.56.1 is my IP on the virtual box net Genymotion is using, yours may be different. To find yours, type: "ifconfig vboxnet0" in terminal)

Viewing mobile device log in realtime:

Android: ``` adb logcat ```
iOS: ``` idevicesyslog ``` (to install, follow: https://github.com/benvium/libimobiledevice-macosx/blob/master/README.md)
