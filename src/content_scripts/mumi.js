const browser = require('webextension-polyfill');

const getPttIntput = () => document.getElementById('t');

const PTT_KEYS = Object.freeze({
  Enter: { key: 'Enter', keyCode: 13 },
  ArrowLeft: { key: 'ArrowLeft', keyCode: 37 },
});

const DEFAULT_KB_OPTS = Object.freeze({
  bubbles: true,
});

const keydownEvent = key => new KeyboardEvent(
  'keydown',
  { ...DEFAULT_KB_OPTS, ...PTT_KEYS[key] },
);

const getBbsLines = () => document.querySelectorAll('[data-type="bbsline"]');

const waitMs = ms => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const waitForDocChange = async ({ timeout = 3000 } = {}) => {
  let mutated = false;
  const onDocumentMutataion = (mutationsList) => {
    mutated = true;
  };

  const observer = new MutationObserver(onDocumentMutataion);
  const pttContentDiv = document.getElementById('mainContainer');
  observer.observe(pttContentDiv, { attributes: true, childList: true, subtree: true });

  const startedAt = (new Date()).getTime();

  for (;;) {
    if (mutated) {
      observer.disconnect();
      return true;
    }

    if ((new Date()).getTime() - startedAt > timeout) {
      observer.disconnect();
      throw new Error('Wait for document mutation timeout.');
    } else {
      // eslint-disable-next-line no-await-in-loop
      await waitMs(10);
    }
  }
};

class PttController {
  constructor(input) {
    this.input = input;
  }

  sendText(text) {
    const { input } = this;

    input.value = text;
    return input.dispatchEvent(new Event('input'));
  }

  sendKey(key) {
    const { input } = this;
    return input.dispatchEvent(keydownEvent(key));
  }

  async gotoMainPage() {
    while (true) {
      const header = getBbsLines()[0].innerHTML;
      if (header.includes('【主功能表】')) {
        return true;
      }

      this.sendKey('ArrowLeft');
      // eslint-disable-next-line no-await-in-loop
      await waitForDocChange();
    }
  }
}


const pushTypes = {
  PUSH: 1,
  ARROW: 2,
  BOO: 3,
};

const pushType = (span) => {
  const matchClassAndHtml = (ele, cName, html) => ele.className === cName && ele.innerHTML === html;

  const isPush = span => matchClassAndHtml(span, 'q15 b0', '<span>推 </span>');
  const isArrow = span => matchClassAndHtml(span, 'q9 b0', '<span>→ </span>');
  const isBoo = span => matchClassAndHtml(span, 'q9 b0', '<span>噓 </span>');
  const typeDetectors = { 1: isPush, 2: isArrow, 3: isBoo };

  for (const key of Object.keys(typeDetectors)) {
    const detector = typeDetectors[key];
    if (detector(span)) {
      return key;
    }
  }

  return null;
};

const pushLineFormat = line => ('children' in line) && ('length' in line.children)
    && (line.children.length === 4);

const matchIdRule = (id) => {
  if (!id) {
    return false;
  }
  const re = /^[A-z][A-z0-9]{3,}$/;
  return re.test(id);
};

const parsePushData = (line) => {
  if (!pushLineFormat(line)) {
    return null;
  }

  const head_span = line.children[0];
  const type = pushType(head_span);

  const idSpan = line.children[1];
  const id = idSpan && idSpan.children[0] && idSpan.children[0].innerHTML;

  if (!type || !matchIdRule(id)) {
    return null;
  }

  return {
    pushType,
    id,
  };
};

const listener = (request, sender, sendResponse) => {
  console.log('mumi!!');
  const input = getPttIntput();
  if (!input) {
    console.error('Could not get PTT input element!');
    return;
  }

  const ptt = new PttController(getPttIntput());
  ptt.gotoMainPage()
    .then(() => { console.log('Main page here!'); });
};
browser.runtime.onMessage.addListener(listener);
