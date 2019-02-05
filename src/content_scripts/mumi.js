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
  const controller = new PttController(getPttIntput());
  const ptt = new Command(controller);

  try {
    if (request === 'go-main') {
      await ptt.gotoMainPage();
      console.log('Main page here!');
    } else if (request === 'get-pushs') {
      await ptt.parsePushs();
      console.log('Parse Push!');
    } else if (request === 'go-store') {
      await ptt.gotoPttStore();
      console.log('Go to store!');
    } else if (request === 'give-p') {
      await ptt.giveMoneyTo('mumiGiveP', '2');
      console.log('Go to store!');
    }
  } catch (error) {
    console.console.error(error);
  }
};
browser.runtime.onMessage.addListener(listener);
