const browser = require('webextension-polyfill');

const ALLOWED_ACTIONS = ['go-main', 'get-pushs'];

document.addEventListener('click', (e) => {
  const action = e.target.name;
  if (ALLOWED_ACTIONS.includes(action)) {
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      browser.tabs.sendMessage(tabs[0].id, action);
    });
  } else if (e.target.classList.contains('clear')) {
    browser.tabs.reload();
    window.close();
  }
});
