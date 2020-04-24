Test app for cordova wkwebview with radaeeplugin 
==================================================

This repo contains a [Cordova](http://cordova.apache.org/) project which builds an app to test functionality of cordova-plugin-ionic-wkwebview and RadaeePDF

# Supported platform versions
This test app supports iOS 9.0+


# Test app functionality
- The app consists of a simple, single page Cordova app written with basic HTML5
- It enables you to open an InappBrowser window and opens a PDF from RadaeePDF website.

# Pre-requisites
The instructions below presume you have a Cordova-capable development environment setup.
If not, see the [Cordova Getting Started guide](http://cordova.apache.org/#getstarted).

# Building and running
- Clone this repo.
- From the root directory, add the iOS platform: `cordova platform add ios`
- Connect a test device
- Run the app: `cordova run ios --device`
    - Note: if you don't specify your Apple Team ID on the command line, you'll need to open the iOS project `platforms/ios/WKWebView Test.xcodeproj` in Xcode and manually configure signing.
