const browser = require("webextension-polyfill");;

const ALLOWED_ACTIONS = ['go-main', 'get-pushs', 'go-store', 'give-p'];

class NoPttTabError extends Error {
  constructor(...args) {
    super(...args);
    this.name = 'NoPttTabError';
  }
}

const sendMessageToCurrentTab = async (message) => {
  const log = document.getElementById('logDiv');
  const activeTabs = await browser.tabs.query({
    active: true,
    currentWindow: true,
    url: 'https://term.ptt.cc/',
  });

  log.innerHTML += `type: ${ typeof activeTabs } <br>`
  log.innerHTML += `type: ${ activeTabs.length } <br>`

  if (activeTabs.length === 0) {
    throw new NoPttTabError();
  }

  log.innerHTML += `Sending to tab: ${ activeTabs[0].id } <br>`

  return browser.tabs.sendMessage(activeTabs[0].id, message);
};

const onButtonClick = (event) => {
  const button = event.target

  const action = button.name;

  if (action === 'clear') {
    browser.tabs.reload();
    window.close();
    return true;
  }

  if (!ALLOWED_ACTIONS.includes(action)) {
    return true;
  }

  sendMessageToCurrentTab(action).catch(e => {
    alert(e.message)
  })

  return false;
};

document.addEventListener('click', onButtonClick);

const form = document.getElementById('mumiForm');
const muming = document.getElementById('mumi-ing-div');

const sendFormToContent = (form) => {
  const data = new FormData(form);
  return sendMessageToCurrentTab(data)
}

form.onsubmit = (event) => {
  event.preventDefault();

  form.style.display = 'none';
  muming.style.display = 'block';

  setTimeout(async () => {
    try {
      const response = await sendFormToContent(event.target)
      muming.innerHTML = response;
    } catch (e) {
      if (e.name === 'NoPttTabError') {
        muming.innerHTML = 'PTT tab not found'
      } else {
        alert(e.message)
      }
    }
  }, 100);

  setTimeout(() => {
    form.style.display = 'block';
    muming.style.display = 'none';
  }, 3000);

  return false;
};
