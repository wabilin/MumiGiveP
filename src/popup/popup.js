const browser = chrome;

const ALLOWED_ACTIONS = ['go-main', 'get-pushs', 'go-store', 'give-p'];

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
};

const form = document.getElementById('mumiForm');
const muming = document.getElementById('mumi-ing-div');
form.onsubmit = (event) => {
  event.preventDefault();

  form.style.display = 'none';
  muming.style.display = 'block';
  setTimeout(() => {
    form.style.display = 'block';
    muming.style.display = 'none';
  }, 3000);

  return false;
};

document.addEventListener('click', onButtonClick);
