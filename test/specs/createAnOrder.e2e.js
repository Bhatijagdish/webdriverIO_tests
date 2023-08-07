const page = require('../../page');
const helper = require('../../helper');

describe('Create an order', () => {
  it('1. Setting the address', async () => {
    await browser.url(`/`);

    // Set the address
    await page.fillAddresses('East 2nd Street, 601', '1300 1st St');

    // Verify that the addresses are filled correctly
    const fromField = await $(page.fromField);
    const toField = await $(page.toField);
    await expect(fromField).toHaveValue('East 2nd Street, 601');
    await expect(toField).toHaveValue('1300 1st St');
  });

  it('2. Selecting Supportive plan', async () => {
    await browser.url(`/`);
  
    await page.fillAddresses('East 2nd Street, 601', '1300 1st St');
  
    // Select the Supportive plan
    const supportivePlanButton = await $(page.supportivePlanButton);
    await supportivePlanButton.click();
  
    // Verify that the Supportive plan is selected
    const planSelected = await $(page.planSelected);
    const attributeValue = await planSelected.getAttribute('class');
    await expect(attributeValue).toContain('active');
  });

  it('3. Filling in the phone number', async () => {
    await browser.url(`/`);
    await page.fillAddresses('East 2nd Street, 601', '1300 1st St');

    const phoneNumber = helper.getPhoneNumber("+1");

    // Fill in the phone number
    await page.fillPhoneNumber(phoneNumber);

    // Verify that the phone number is filled correctly
    const phoneNumberField = await $(page.phoneNumberField);
    await expect(phoneNumberField).toHaveValue(phoneNumber);
  });

  it('4. Adding a credit card', async () => {
    await browser.url(`/`);
    await page.fillAddresses('East 2nd Street, 601', '1300 1st St');

    // Select Payment Method as Card
      const paymentMethod = await $(page.paymentMethod);
    await paymentMethod.click();

    const addCardButton = await $(page.addCardButton);
    await addCardButton.click();

    // Enter credit card details
    const cardNumberInput = await $(page.cardNumberInput);
    await cardNumberInput.setValue('1234567890123456');

    const cardCvvInput = await $(page.codeField);
    await cardCvvInput.setValue('123');

    await browser.execute(() => {
      document.activeElement.blur();
    });

    const linkButton = await $(page.linkButton);
    await expect(linkButton).toBeEnabled();
    await linkButton.click();

    // Verify that the card is added
    const addedCard = await $(page.addedCard);
    await expect(addedCard).toBeExisting();

    const addedCardChecked = await $(page.addedCardChecked);
    await expect(addedCardChecked).toBeChecked();
  });

  it('5. Writing a message for the driver', async () => {
    await browser.url(`/`);
    await page.fillAddresses('East 2nd Street, 601', '1300 1st St');

    // Enter a message for the driver
    const messageInput = await $(page.messageInput);
    await messageInput.setValue('Please arrive 10 minutes early.');

    // Verify that the message is added
    await expect(messageInput).toHaveValue('Please arrive 10 minutes early.');
  });

  it('6. Ordering a Blanket and handkerchiefs', async () => {
    await browser.url(`/`);
    await page.fillAddresses('East 2nd Street, 601', '1300 1st St');

    const supportivePlanButton = await $(page.supportivePlanButton);
    await supportivePlanButton.click();

    await page.expandOrderDetails(); 

    // Select Blanket and handkerchiefs
    const blanketHandkerchiefsButton = await $(page.orderState);
    await blanketHandkerchiefsButton.click();
    let backgroundColor=null;
    await blanketHandkerchiefsButton.waitUntil(
      async function(){
        backgroundColor = await blanketHandkerchiefsButton.getCSSProperty('background-color')
        return (await backgroundColor.parsed.hex.includes('007eff')); 
      },
      {
        timeout: 5000,
        timeoutMsg: "Unable to order blanket and handkerchiefs",
      }
    )
    // Verify that Blanket and handkerchiefs are ordered
    await expect(backgroundColor.parsed.hex).toContain('007eff');
  });

  it('7. Ordering 2 Ice creams', async () => {
    await browser.url(`/`);
    await page.fillAddresses('East 2nd Street, 601', '1300 1st St');

    const supportivePlanButton = await $(page.supportivePlanButton);
    await supportivePlanButton.click();

    await page.expandOrderDetails();

    // Select 2 Ice creams
    const iceCreamsInput = await $(page.iceCreamsInput);
    await iceCreamsInput.click();
    await iceCreamsInput.click();

    const iceCreamsValue = await $(page.iceCreamsValue);
    // Verify that the quantity is set to 2
    await expect(iceCreamsValue).toHaveText('2');
  });

  it('8. The car search modal appears', async () => {
    await browser.url(`/`);
    await page.fillAddresses('East 2nd Street, 601', '1300 1st St');

    // Click the search button
    const searchButton = await $(page.searchButton);
    await searchButton.click();

    // Verify that the car search modal appears
    const carSearchModal = await $(page.carSearchModal);
    await expect(carSearchModal).toBeExisting();
  });

  it('9. Waiting for the driver info to appear in the modal (optional)', async () => {
    await browser.url(`/`);
    await page.fillAddresses('East 2nd Street, 601', '1300 1st St');

    const businessPlanButton = await $(page.businessPlanButton);
    await businessPlanButton.click();
    // Click the search button
    const searchButton = await $(page.searchButton);
    await searchButton.click();
    // Verify that the car search modal appears
    const carSearchModal = await $(page.carSearchModal);
    await expect(carSearchModal).toBeExisting();

    // Wait for driver info to appear in the modal
    let modalItems = null;
    await carSearchModal.waitUntil(
      async function(){
        modalItems = await $$(page.carModalItems);
        return (await modalItems.length===3); 
      },
      {
        timeout: 40000,
        timeoutMsg: "Unable to find a driver",
      }
    )
    await expect(modalItems).toBeElementsArrayOfSize(3);
  });
});
