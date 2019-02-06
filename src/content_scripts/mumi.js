const browser = require('webextension-polyfill');
const PttController = require('./PttController');
const Command = require('./Command');

const getPttIntput = () => document.getElementById('t');

const listener = async (request) => {
  const input = getPttIntput();

  try {
    if (!input) {
      throw new Error('Could not get PTT input element!');
    }

    const controller = new PttController(input);
    const ptt = new Command(controller);

    const res = await ptt.mumiGiveP(request);
    if (res.success) {
      return {
        success: true,
        ids: res.ids,
      };
    }
    throw new Error('Unknown fail');
  } catch (error) {
    return {
      error,
      success: false,
    };
  }
};

browser.runtime.onMessage.addListener(listener);
