// @flow

const PTT_KEYS = Object.freeze({
  Enter: { keyCode: 13 },
  ArrowLeft: { keyCode: 37 },
  ArrowRight: { keyCode: 39 },
  PageDown: { keyCode: 34 },
});

const DEFAULT_KB_OPTS = Object.freeze({
  bubbles: true,
});

const keydownEvent = (key: string) => new KeyboardEvent(
  'keydown', {
    key,
    ...DEFAULT_KB_OPTS,
    ...PTT_KEYS[key],
  },
);

class PttController {
  input: HTMLInputElement;

  constructor(pttInput: HTMLInputElement) {
    this.input = pttInput;
  }

  sendText(text: string) {
    const { input } = this;

    input.value = text;
    return input.dispatchEvent(new Event('input'));
  }

  sendKey(key: string) {
    const { input } = this;
    return input.dispatchEvent(keydownEvent(key));
  }

  enterList(titleChar: string) {
    this.sendText(titleChar);
    this.sendKey('ArrowRight');
  }
}

export default PttController;
