const browser = require('webextension-polyfill');
const PttController = require('./PttController');

const getPttIntput = () => document.getElementById('t');

const listener = (request, sender, sendResponse) => {
  console.log(request);
  const input = getPttIntput();
  if (!input) {
    console.error('Could not get PTT input element!');
    return;
  }
  const ptt = new PttController(getPttIntput());

  if (request === 'go-main') {
    ptt.gotoMainPage()
      .then(() => { console.log('Main page here!'); });
  } else if (request === 'get-pushs') {
    ptt.parsePushs()
    .then(() => { console.log('Parse Push!'); });
  }
};
browser.runtime.onMessage.addListener(listener);
