/* eslint-disable no-undef */
describe('Clients tests', () => {
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
    await element(by.id('loginEmailInput')).typeText('prod-c@gmail.com');
    await element(by.id('passwordPasswordInput')).typeText('12345678');
    await element(by.id('loginContinueButton')).tap();
    // photos
    await element(by.id('bottomTabPhotos')).tap();
    await element(by.id('photosTabPhotos')).tap();
    await expect(element(by.id('photosUploadPhotoButton'))).toBeVisible();
    // privacy
    await element(by.id('bottomTabMore')).tap();
    await element(by.id('morePrivacyButton')).tap();
    await expect(element(by.id('privacyPolicyContainer'))).toBeVisible();
    // Change language
    await element(by.id('bottomTabMore')).tap();
    await element(by.id('moreAccountButton')).tap();
    await expect(element(by.id('accountSettingContainer'))).toBeVisible();
    await element(by.id('accountSettingInputDropdown')).tap();
    await element(by.id('accountSettingLanguage.Spanish')).tap();
    await expect(element(by.id('accountSettingTitle'))).toHaveText(
      'Configuración de la cuenta',
    );
    await element(by.id('accountSettingInputDropdown')).tap();
    await element(by.id('accountSettingLanguage.English')).tap();
    // render tab trip
    await element(by.id('bottomTabTrip')).tap();
    // render tab chat
    await element(by.id('bottomTabChat')).tap();
  });
});
