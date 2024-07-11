/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'e2e/jest.config.js',
    },
    jest: {
      setupTimeout: 120000,
    },
  },
  apps: {
    'production.ios.debug': {
      type: 'ios.app',
      binaryPath:
        'ios/build/Build/Products/Debug-iphonesimulator/VenturaTravel.app',
      build:
        'xcodebuild -workspace ios/VenturaTravel.xcworkspace -scheme VenturaTravel -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
    },
    'production.ios.release': {
      type: 'ios.app',
      binaryPath:
        'ios/build/Build/Products/Release-iphonesimulator/VenturaTravel.app',
      build:
        'xcodebuild -workspace ios/VenturaTravel.xcworkspace -scheme VenturaTravel -configuration Release -sdk iphonesimulator -derivedDataPath ios/build',
    },
    'production.android.debug': {
      type: 'android.apk',
      binaryPath:
        'android/app/build/outputs/apk/production/debug/app-production-debug.apk',
      build:
        'cd android && ./gradlew assembleProductionDebug assembleProductionDebugAndroidTest -DtestBuildType=debug',
      reversePorts: [8081],
    },
    'production.android.release': {
      type: 'android.apk',
      binaryPath:
        'android/app/build/outputs/apk/production/release/app-production-release.apk',
      build:
        'cd android && ./gradlew assembleProductionRelease assembleProductionReleaseAndroidTest -DtestBuildType=release',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 13',
      },
    },
    attached: {
      type: 'android.attached',
      device: {
        adbName: '.*',
      },
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_6_Pro_API_31',
      },
    },
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'production.ios.debug',
    },
    'ios.sim.release': {
      device: 'simulator',
      app: 'production.ios.release',
    },
    'android.att.debug': {
      device: 'attached',
      app: 'production.android.debug',
    },
    'android.att.release': {
      device: 'attached',
      app: 'production.android.release',
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'production.android.debug',
    },
    'android.emu.release': {
      device: 'emulator',
      app: 'production.android.release',
    },
  },
};
