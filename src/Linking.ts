const config = {
  screens: {
    DashboardTc: {
      path: 'tc/:departureId',
      parse: {
        departureId: departureId => `${departureId}`,
      },
    },
  },
};

const linking = {
  prefixes: [
    'update-departure-tc://',
    'https://app-store-verification.venturatravel.org',
  ],
  config,
};
/**
 * How to Test deeplinks
 * Android
 * 1. adb shell am start -W -a android.intent.action.VIEW -d "update-departure-tc://DashboardTc/123123" com.venturatravel.dev
 * 2. npx uri-scheme open "update-departure-tc://tc/99999" --android
 *
 * iOS
 * 1. npx uri-scheme open "update-departure-tc://tc/99999" --ios
 *
 * Daniel 9 Mar 23
 */

export default linking;
