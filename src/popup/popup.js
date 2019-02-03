const browser = chrome;

const ALLOWED_ACTIONS = ['go-main', 'get-pushs'];

const onButtonClick = (event) => {
  const action = event.target.name;
  if (action === 'clear') {
    browser.tabs.reload();
    window.close();
    return;
  }

  if (!ALLOWED_ACTIONS.includes(action)) {
    return;
  }

  browser.tabs.query({
    active: true,
    currentWindow: true,
  }, (activeTabs) => {
    browser.tabs.sendMessage(activeTabs[0].id, action);
  });
}
document.addEventListener('click', onButtonClick);
