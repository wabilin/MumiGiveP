const browser = require("webextension-polyfill");;

class NoPttTabError extends Error {
  constructor(...args) {
    super(...args);
    this.name = 'NoPttTabError';
  }
}

const hideElement = (e) => e.style.display = 'nono';
const showElement = (e) => e.style.display = 'block';
const hideMessages = () => {
  hideElement(document.getElementById('successMsg'))
  hideElement(document.getElementById('errorMsg'))
}
const showSuccess = (text) => {
  const success = document.getElementById('successMsg')
  success.innerHTML = text;
  showElement(success)
}

const showError = (text) => {
  const error = document.getElementById('successMsg')
  error.innerHTML = text;
  showElement(error)
}

const sendMessageToCurrentTab = async (message) => {
  const activeTabs = await browser.tabs.query({
    active: true,
    currentWindow: true,
    url: 'https://term.ptt.cc/',
  });

  if (activeTabs.length === 0) {
    throw new NoPttTabError();
  }

  return browser.tabs.sendMessage(activeTabs[0].id, message);
};

const form = document.getElementById('mumiForm');
const muming = document.getElementById('mumi-ing-div');

const sendFormToContent = (form) => {
  const data = new FormData(form);
  return sendMessageToCurrentTab(data)
}

form.onsubmit = (event) => {
  event.preventDefault();

  hideElement(form)
  showElement(muming)
  hideMessages();

  sendFormToContent(event.target)
    .then(response => {
      form.style.display = 'block';
      muming.style.display = 'none';
      hideElement(muming)
      showElement(form)
      showSuccess(response.id)
    })
    .catch(e => {
      if (e.name === 'NoPttTabError') {
        muming.innerHTML = 'PTT tab not found'
      } else {
        showError(e.message)
      }
    })

  return false;
};
