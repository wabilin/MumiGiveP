const { PushType, parsePushData } = require('./pushParser');

const buildExamlePush = () => {
  const line = document.createElement('span');
  line.innerHTML = `
  <span>
    <span class="q15 b0">推 </span>
    <span class="q11 b0">Misora</span>
    <span class="q3 b0">: 這款80%小劇情，只有20%是主線展開，不喜歡小劇情的不適合  </span>
    <span class="q7 b0">04/17 12:27  </span>
  </span>
  `;
  return line;
};

describe('parsePushData', () => {
  describe('Expected content', () => {
    it('Could parse "推"', () => {
      const line = buildExamlePush();
      expect(parsePushData(line).type).toEqual(PushType.PUSH);
    });

    it('Could parse "->"', () => {
      const line = buildExamlePush();
      const span = line.children[0];
      span.children[0].innerHTML = '→ ';
      span.children[0].className = 'q9 b0';
      expect(parsePushData(line).type).toEqual(PushType.ARROW);
    });

    it('Could parse "噓"', () => {
      const line = buildExamlePush();
      const span = line.children[0];
      span.children[0].innerHTML = '噓 ';
      span.children[0].className = 'q9 b0';
      expect(parsePushData(line).type).toEqual(PushType.BOO);
    });

    it('Could parse PTT user ID', () => {
      const line = buildExamlePush();
      expect(parsePushData(line).id).toEqual('Misora');
    });
  });

  describe('Invalid children', () => {
    it('returns null', () => {
      const line = buildExamlePush();
      const span = line.children[0];
      span.removeChild(span.children[3]);
      span.removeChild(span.children[2]);
      expect(parsePushData(line)).toBe(null);
    });
  });

  describe('Invalid push type', () => {
    it('returns null', () => {
      const line = buildExamlePush();
      const span = line.children[0];
      span.children[0].innerHTML = '啥';
      expect(parsePushData(line)).toBe(null);
    });
  });

  describe('Invalid user ID', () => {
    it('returns null', () => {
      const line = buildExamlePush();
      const span = line.children[0];
      span.children[1].innerHTML = '5566';
      expect(parsePushData(line)).toBe(null);
    });
  });
});
