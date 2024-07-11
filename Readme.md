# Travel App - React Native

Before you can start working on this project, you will need to read and follow the React Native documentation: [Link Here](https://reactnative.dev/docs/environment-setup), unfortunately we can not put here the steps, due to it will depend on your OS and your development target, you will need to install Android Studio and/or XCode, the emulators, node, homebrew, JDK and set some path environments.

An important note that you will find on the docs, is that you should not use the React Native CLI, instead of it, use **_npx_** to avoid errors, also when you find in the docs a command that depends on if the project was made with Expo or React Native CLI, select **_CLI or Bare React Native_** and in case you find the same thing with **_CocoaPods_** or not (only for IOS development or OSX machines), choose the CocoaPods Option.

If you do not avoid any of the React Native documentation steps, you will not have any problem to run the project.

## Steps

Clone the project on your machine

> git clone git@gitlab.com:ventura-travel-it/ventura-fenix/frontend/ventura-travel-app.git

Open the folder

> cd ventura-travel-app

Install the dependencies

> yarn install

#### To run ios app (Only works if you have a mac)

Install pods

> cd ios && pod install

return to the root folder

> cd ..

run the project

> npx react-native run-ios

And the emulator should open, and you could start to code!

#### To run android app (you will need to have android studio open with an emulator created)

run metro

> npx react-native start

run the project

> npx react-native run-android

And the emulator should open, and you could start to code!
