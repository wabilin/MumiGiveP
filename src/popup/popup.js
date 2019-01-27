const browser = require("webextension-polyfill");

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("mumi")) {
    const _content = e.target.textContent;

    browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
      browser.tabs.sendMessage(tabs[0].id, 'Hello');
    });
  }
  else if (e.target.classList.contains("clear")) {
    browser.tabs.reload();
    window.close();
  }
});
