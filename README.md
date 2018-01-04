Confusion Android Application
=============================

An ionic application developed as a homework assignment for __*Multiplatform Mobile App Development with Web Technologies*__ course of the __*Hong Kong University of Science and Technology*__ through __*coursera.org*__

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