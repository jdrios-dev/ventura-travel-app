/* eslint-disable no-undef */
describe('TCs tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should complete flow TC', async () => {
    //welcome
    await expect(element(by.id('languageSelectionScreen'))).toBeVisible();
    await element(by.id('langSelectionDropdown')).tap();
    await element(by.id('langSelectionDropdown.English')).tap();
    await element(by.id('langSelectNextButton')).tap();
    //login
    await expect(element(by.id('loginScreen'))).toBeVisible();
    await element(by.id('loginEmailInput')).typeText('prod@gmail.com');
    await element(by.id('passwordPasswordInput')).typeText('12345678');
    await element(by.id('loginContinueButton')).tap();
    // trip
    await expect(element(by.id('dashboardHelloTitle'))).toHaveText('Hi');
    await element(by.id('bottomTabTrip')).tap();
    await element(by.id('guidePlanDayNumber.2')).tap();
    await expect(element(by.id('dayDetailTitle'))).toHaveText('Day 2');
    // services
    await element(by.id('dayDetailTabService')).tap();
    await expect(element(by.id('dayDetailTabService.1'))).toHaveText(
      'Bike tour CDMX XMEX/CMEX',
    );
    // photos
    await element(by.id('headerBackButton')).tap();
    await element(by.id('bottomTabPhotos')).tap();
    await element(by.id('photosTabPhotos')).tap();
    await expect(element(by.id('photosUploadPhotoButton'))).toBeVisible();
    // passenger
    await element(by.id('bottomTabMore')).tap();
    await element(by.id('morePassengerButton')).tap();
    await expect(element(by.id('myTripTcTravelerList'))).toBeVisible();
  });
});
