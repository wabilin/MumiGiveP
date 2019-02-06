const browser = require('webextension-polyfill');
const PttController = require('./PttController');
const Command = require('./Command');

const getPttIntput = () => document.getElementById('t');

// const listener = async (request, sender, sendResponse)
const listener = async (request) => {
  console.log(`Got message: ${request}`);
  const input = getPttIntput();
  if (!input) {
    console.error('Could not get PTT input element!');
    return;
  }
  const controller = new PttController(input);
  const ptt = new Command(controller);

  try {
    if (request instanceof FormData) {
      console.log('Use FormData!');
      const res = await ptt.mumiGiveP(request);
      if (res.success) {
        alert(`ID sent: ${res.ids.join(', ')}`)
      } else {
        throw new Error('Unknown fail')
      }

    } else if (request === 'go-main') {
      await ptt.gotoMainPage();
      console.log('Main page here!');
    } else if (request === 'get-pushs') {
      await ptt.parsePushs();
      console.log('Parse Push!');
    } else if (request === 'go-store') {
      await ptt.gotoPttStore();
      console.log('Go to store!');
    } else if (request === 'give-p') {
      await ptt.giveMoneyTo('mumiGiveP', '2', prompt('pass:'));
      console.log('Go to store!');
    }
  } catch (error) {
    console.error(error);
  }
};

browser.runtime.onMessage.addListener(listener)
// browser.runtime.onMessage.addListener(request => {
//   console.log("Got message from popup");
//   return Promise.resolve("Hi from content script");
// });
