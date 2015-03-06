#!/bin/sh
gulp remove-proxy
ionic build --release android
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore platforms/android/ant-build/CordovaApp-release-unsigned.apk alias_name
zipalign -f -v 4 platforms/android/ant-build/CordovaApp-release-unsigned.apk platforms/android/ant-build/CordovaApp-release-aligned.apk