# Description

לא משנה אם אתם ימין, מרכז או שמאל. כאן תוכלו לראות לאיזו מפלגה החברים שלכם מתכוונים להצביע ולנסות להשפיע עליהם באווירה מכבדת ומקבלת.

https://ivote.org.il

# Installation
To setup build for native, do these steps:

first remove the facebook connect plugin to prevent errors when adding platforms:

``` ionic plugin remove com.phonegap.plugins.facebookconnect ```

Now add pltforms

```
ionic platform add android
ionic platform add ios
```

Add the facebook connect plugin back
``` cordova -d plugin add https://github.com/Wizcorp/phonegap-facebook-plugin.git --variable APP_ID="1557020157879112" --variable APP_NAME="iVote" ```

Now you should be able to build:

```
ionic build ios
ionic build android
```

Note: why is the facebook plugin part of the repo in the first place if we remove and add?
The reason is for web facebook login we want it in, but when moving to mobile, if its in and you do a platform add,
you will get an error as APP_ID and APP_NAME are not set, this error prevents all plugins from being added.


Before building a release version, the console plugin should be removed:
ionic plugin rm org.apache.cordova.console

then, build a release version:
ionic build --release android

to sign the jar type:
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore platforms/android/ant-build/CordovaApp-release-unsigned.apk alias_name
it will ask for a passcode, which is ivote2015

finally use zipalign:
zipalign -f -v 4 platforms/android/ant-build/CordovaApp-release-unsigned.apk platforms/android/ant-build/CordovaApp-release-aligned.apk

(if zipalign is not found, you may need to copy it from Android SDK build-tool/<version>/zipalign to Android SDK tools/zipalign)

The resulting aligned APK can be uploaded to Google Play

Shortcut: I made a build_android.sh script for the above 3 steps for building an apk for release to Google Play
you can use that. Make sure to increment android-versionCode in config.xml before uploading to Google Play. You may also update the version name


For testing locally with Genymotion you need to reference the local server like that:
.value('ApiEndpoint', 'http://192.168.56.1:3000/api')

(note the 192.168.56.1 is my IP on the virtual box net Genymotion is using, yours may be different.
 to find yours, type: "ifconfig vboxnet0" in terminal)

Viewing mobile device log in realtime:
Android: adb logcat
iOS: idevicesyslog (to install, follow: https://github.com/benvium/libimobiledevice-macosx/blob/master/README.md)
