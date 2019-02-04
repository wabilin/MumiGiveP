const { PushType, parsePushData } = require('./pushParser');

const buildExamlePush = () => {
  const span = document.createElement('span');
  span.innerHTML = `
  <span class="q15 b0">推 </span>
  <span class="q11 b0">Misora</span>
  <span class="q3 b0">: 這款80%小劇情，只有20%是主線展開，不喜歡小劇情的不適合  </span>
  <span class="q7 b0">04/17 12:27  </span>
  `;
  return span;
};

describe('parsePushData', () => {
  describe('Expected content', () => {
    it('Could parse "推"', () => {
      const span = buildExamlePush();
      expect(parsePushData(span).type).toEqual(PushType.PUSH);
    });

    it('Could parse "->"', () => {
      const span = buildExamlePush();
      span.children[0].innerHTML = '→ ';
      span.children[0].className = 'q9 b0';
      expect(parsePushData(span).type).toEqual(PushType.ARROW);
    });

    it('Could parse "噓"', () => {
      const span = buildExamlePush();
      span.children[0].innerHTML = '噓 ';
      span.children[0].className = 'q9 b0';
      expect(parsePushData(span).type).toEqual(PushType.BOO);
    });

    it('Could parse PTT user ID', () => {
      const span = buildExamlePush();
      expect(parsePushData(span).id).toEqual('Misora');
    });

    it('Could parse comment', () => {
      const span = buildExamlePush();

      expect(parsePushData(span).comment).toEqual(
        ': 這款80%小劇情，只有20%是主線展開，不喜歡小劇情的不適合  ',
      );
    });

    it('Could parse timestamp', () => {
      const span = buildExamlePush();
      expect(parsePushData(span).timestamp).toEqual('04/17 12:27  ');
    });
  });

  describe('Invalid children', () => {
    it('returns null', () => {
      const span = buildExamlePush();
      span.removeChild(span.children[3]);
      expect(parsePushData(span)).toBe(null);
    });
  });

  describe('Invalid push type', () => {
    it('returns null', () => {
      const span = buildExamlePush();
      span.children[0].innerHTML = '啥';
      expect(parsePushData(span)).toBe(null);
    });
  });

  describe('Invalid user ID', () => {
    it('returns null', () => {
      const span = buildExamlePush();
      span.children[1].innerHTML = '5566';
      expect(parsePushData(span)).toBe(null);
    });
  });
});
