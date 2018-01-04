Confusion Android Application
=============================

An ionic application developed as a homework assignment for Multiplatform Mobile App Development with Web Technologies course of the Hong Kong University of Science and Technology through coursera.org

## Prerequisites
* NodeJS
* ionic
* cordova
* jdk 8 ( _jdk 9 does not work well with ionic at the time of writing_ )
* Android SDK

## Using this project
#### Clone the repository
```bash
$ git init
$ git clone https://github.com/vangelhristov/confusion-ionic.git
```
#### Install dependencies
```bash
$ cd confusion-ionic
$ npm i
$ bower i
```
#### Reinstall android platform
```bash
$ cordova platform rm android
$ cordova platform add android
```
#### Connect your android device and run the application
```vash
$ cordova run android
```

## Links
[certificate for completion](https://www.coursera.org/account/accomplishments/records/67NE3WGR2MDD)