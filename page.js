module.exports = {
  // Inputs
  fromField: '#from',
  toField: '#to',
  phoneNumberField: '#phone',
  codeField: '#code.card-input',
  cardCvvInput: '#cvv',
  cardNumberInput: '#number.card-input',
  cardExpiryInput: '#cardExpiry',
  messageInput: '#comment',
  iceCreamsInput: '//div[text()="Ice cream"]/following-sibling::div//div[@class="counter-plus"]',
  iceCreamsValue: '//div[text()="Ice cream"]/following-sibling::div//div[@class="counter-value"]',

  // Buttons
  callATaxiButton: '//button[text()="Call a taxi"]',
  businessPlanButton: 'div.tcard:nth-of-type(1) > div',
  supportivePlanButton: 'div.tcard:nth-of-type(5) > div',
  phoneNumberButton: '//div[starts-with(text(), "Phone number")]',
  nextButton: '//button[text()="Next"]',
  confirmButton: '//button[text()="Confirm"]',
  linkButton: '//button[text()="Link"]',
  searchButton: '.smart-button',
  expandOrderRequirements: 'div.reqs-arrow',

  //switch buttons
  blanketHandkerchiefsButton: '//div[text()="Blanket and handkerchiefs"]/parent::div//input',
  orderState: '//div[text()="Blanket and handkerchiefs"]/parent::div//span',
  
  // Modals
  phoneNumberModal: '.modal',
  carSearchModal: 'div.order-body',
  driverRating: 'div.order-btn-rating',
  carModalItems: 'div.order-btn-group',

  // Elements
  planSelected: 'div.tcard:nth-of-type(5)',
  paymentMethod: 'div.pp-value-arrow',
  addCardButton: '//div[text()="Add card"]',
  addedCard: 'div.pp-row:nth-of-type(3) > div.pp-title',
  addedCardChecked: 'input#card-1',
  
  // Functions
  fillAddresses: async function (from, to) {
    const fromField = await $(this.fromField);
    await fromField.setValue(from);

    const toField = await $(this.toField);
    await toField.setValue(to);

    const callATaxiButton = await $(this.callATaxiButton);
    await callATaxiButton.waitForDisplayed();
    await callATaxiButton.click();
  },

  fillPhoneNumber: async function (phoneNumber) {
    const phoneNumberButton = await $(this.phoneNumberButton);
    await phoneNumberButton.waitForDisplayed();
    await phoneNumberButton.click();

    const phoneNumberModal = await $(this.phoneNumberModal);
    await phoneNumberModal.waitForDisplayed();

    const phoneNumberField = await $(this.phoneNumberField);
    await phoneNumberField.waitForDisplayed();
    await phoneNumberField.setValue(phoneNumber);
  },

  submitPhoneNumber: async function (phoneNumber) {
    await this.fillPhoneNumber(phoneNumber);
    await browser.setupInterceptor();
    await $(this.nextButton).click();
    // await browser.pause(2000);
    const codeField = await $(this.codeField);
    const requests = await browser.getRequests();
    await expect(requests.length).toBe(1);
    const code = await requests[0].response.body.code;
    await codeField.setValue(code);
    await $(this.confirmButton).click();
  },

  expandOrderDetails: async function (){
    const expandOrderRequirements = await $(this.expandOrderRequirements);
    await expandOrderRequirements.click();
    await expandOrderRequirements.waitUntil(
      async function(){
        await expandOrderRequirements.click();
        const attributeValue = await this.getAttribute('class');
        return (await attributeValue.includes('open')); 
      },
      {
        timeout: 5000,
        timeoutMsg: "Order Options did not expand",
      }
    )
  },
};

