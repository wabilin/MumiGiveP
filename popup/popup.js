document.addEventListener("click", (e) => {
  if (e.target.classList.contains("mumi")) {
    const chosenBeast = e.target.textContent;

    if (chrome) {
      browser = chrome;
    }

    // browser.tabs.executeScript(null, {
    //   file: "/content_scripts/mumi.js"
    // });

    browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
      browser.tabs.sendMessage(tabs[0].id, 'Hello');
    });
  }
  else if (e.target.classList.contains("clear")) {
    browser.tabs.reload();
    window.close();
  }
});
