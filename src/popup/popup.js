import browser from 'webextension-polyfill';

const findTarget = q => (
  (typeof (q) === 'string') ? document.getElementById(q) : q
);

const hideElement = (target) => {
  findTarget(target).style.display = 'none';
};
const showElement = (target) => {
  findTarget(target).style.display = 'block';
};

const hideMessages = () => {
  hideElement('successMsg');
  hideElement('errorMsg');
};
const showSuccess = (text) => {
  const success = document.getElementById('successMsg');
  success.textContent = text;
  showElement(success);
};

const showError = (text) => {
  const error = document.getElementById('errorMsg');
  error.textContent = text;
  showElement(error);
};

const sendMessageToCurrentTab = async (message) => {
  const activeTabs = await browser.tabs.query({
    active: true,
    currentWindow: true,
    url: 'https://term.ptt.cc/',
  });

  if (activeTabs.length === 0) {
    throw new Error('現在開啟的分頁並非 PTT 分頁，請開啟 https://term.ptt.cc');
  }

  await browser.tabs.executeScript({
    file: 'mumi.js',
  });

  return browser.tabs.sendMessage(activeTabs[0].id, message);
};

const sendFormToContent = async (form) => {
  const formData = new FormData(form);
  const data = {};
  [...formData.entries()].forEach(([key, value]) => {
    data[key] = value;
  });

  return sendMessageToCurrentTab(data);
};

const form = document.getElementById('mumiForm');
const muming = document.getElementById('mumi-ing-div');

form.onsubmit = (event) => {
  event.preventDefault();

  hideElement(form);
  showElement(muming);
  hideMessages();

  sendFormToContent(event.target)
    .then((response) => {
      hideElement(muming);
      showElement(form);

      const { success, message, error } = response;
      if (success) {
        showSuccess(message);
      } else {
        showError(error);
      }
    })
    .catch((e) => {
      showError(e.message);
      hideElement(muming);
      showElement(form);
    });

  return false;
};

function askConfirm(ids) {
  let done = false;
  const [yesButton, noButton, confirmMessage] = ['comfirmYes', 'comfirmNo', 'confirmMessage']
    .map(id => document.getElementById(id));

  const idListP = document.createElement('p');
  idListP.textContent = ids.join(', ');
  confirmMessage.textContent = '確認要發送 P 幣 給以下 ID 嗎?';
  confirmMessage.appendChild(idListP);

  const finish = () => {
    done = true;
    yesButton.onclick = null;
    noButton.onclick = null;
    confirmMessage.innerHTML = '';
    hideElement('confirmBlock');
  };

  showElement('confirmBlock');

  return new Promise((reslove, reject) => {
    yesButton.onclick = () => {
      finish();
      reslove(true);
    };

    noButton.onclick = () => {
      finish();
      reslove(false);
    };

    setTimeout(() => {
      if (!done) {
        finish();
        reject(new Error('Timeout'));
      }
    }, 30000);
  });
}

async function handleMessage(request) {
  const { action } = request;
  if (action && action === 'confirmId') {
    const ok = await askConfirm(request.ids);
    return { ok };
  }
  return null;
}
browser.runtime.onMessage.addListener(handleMessage);
