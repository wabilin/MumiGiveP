const pttContent = require('./pttContent');
const pushParser = require('./pushParser');

class Command {
  constructor(controller) {
    this.controller = controller;
  }

  gotoMainPage() {
    const { controller } = this;

    return pttContent.repeatTillMatch(
      { row: 0 },
      { target: 'text', includes: '【主功能表】' },
      () => { controller.sendKey('ArrowLeft'); },
    );
  }

  async parsePushs() {
    const { controller } = this;

    const isInArticle = pttContent.matches(
      { row: 23 }, { target: 'text', regex: /瀏覽\s*第\s*\d+\/\d+\s*頁/ },
    );
    if (!isInArticle) { throw new Error('Not in an article'); }

    // Go to top
    await pttContent.repeatTillMatch(
      { row: 23 }, { target: 'text', regex: /瀏覽\s*第\s*1\/\d+\s*頁/ },
      () => { controller.sendText('0'); },
    );

    // Go to article ending
    await pttContent.repeatTillMatch(
      { row: 'any' },
      { target: 'html', includes: '<span class="q2 b0">※ 文章網址: </span>' },
      () => { controller.sendKey('PageDown'); },
    );

    let collectedLines = [];
    for (;;) {
      const currentLines = [...pttContent.getBbsLines()]
        .map(line => line.cloneNode(true));
      collectedLines = [...collectedLines, ...currentLines];

      const isEnd = pttContent.matches({ row: 23 }, {
        target: 'text',
        includes: '(100%)',
      });
      if (isEnd) { break; }

      controller.sendKey('PageDown');
      await pttContent.waitChange();
    }

    return pushParser.getPushInfos(collectedLines);
  }
}

module.exports = Command;
