const pttContent = require('./pttContent');

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

class PttController {
  constructor(pttInput) {
    this.input = pttInput;
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
    try {
      await pttContent.repeatTillMatch(
        { row: 0 },
        { textIncluded: '【主功能表】' },
        () => { this.sendKey('ArrowLeft'); },
      );
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = PttController;
