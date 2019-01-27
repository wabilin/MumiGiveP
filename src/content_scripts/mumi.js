const browser = require('webextension-polyfill');
const PttController = require('./PttController');

const getPttIntput = () => document.getElementById('t');

const listener = (request, sender, sendResponse) => {
  console.log(request);
  if (request === 'go-main') {
    const input = getPttIntput();
    if (!input) {
      console.error('Could not get PTT input element!');
      return;
    }

    const ptt = new PttController(getPttIntput());
    ptt.gotoMainPage()
      .then(() => { console.log('Main page here!'); });
  }
};
browser.runtime.onMessage.addListener(listener);
