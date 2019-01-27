const pttContent = require('./pttContent');

const PTT_KEYS = Object.freeze({
  Enter: { key: 'Enter', keyCode: 13 },
  ArrowLeft: { key: 'ArrowLeft', keyCode: 37 },
  ArrowRight: { key: 'ArrowRight', keyCode: 39 },
  PageDown: { key: 'PageDown', keyCode: 34 },
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

  enterList(titleChar) {
    this.sendText(titleChar);
    this.sendKey('ArrowRight');
  }

  async gotoMainPage() {
    try {
      await pttContent.repeatTillMatch(
        { row: 0 },
        { target: 'text', includes: '【主功能表】' },
        () => { this.sendKey('ArrowLeft'); },
      );
    } catch (err) {
      console.error(err);
    }
  }
  async parsePushs() {
    try {
      await pttContent.repeatTillMatch(
        { row: 'all' },
        { target: 'html', includes: '<span class=\"q2 b0\">※ 文章網址: </span>' },
        () => { this.sendKey('PageDown'); },
      );
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = PttController;
