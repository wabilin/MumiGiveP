const pttContent = require('./pttContent');
const pushParser = require('./pushParser');

class Command {
  constructor(controller) {
    this.controller = controller;
  }

  // ---- global commands ----

  gotoMainPage() {
    return pttContent.repeatTillMatch(
      { row: 0 },
      { target: 'text', includes: '【主功能表】' },
      () => { this.sendKey('ArrowLeft'); },
    );
  }

  async parsePushs() {
    if (!pttContent.isInArticle()) {
      throw new Error('Not in an article');
    }

    await this.inArticleGotoPageBeginning();
    await this.inArticleGotoArticleEnding();

    const collectedLines = await this.inArticleCollectPushLines();

    return pushParser.getPushInfos(collectedLines);
  }

  async gotoPttStore() {
    const isInPttStore = pttContent.matches(
      { row: 0 }, { target: 'text', includes: '【Ｐtt量販店】' },
    );

    if (isInPttStore) { return true; }

    await this.gotoMainPage();

    await this.fromMainToPlayground();

    return this.fromPlaygroundToStore();
  }

  async giveMoneyTo() {
    return this.gotoPttStore();
  }

  // ---- global commands end ----

  inArticleGotoArticleEnding() {
    return pttContent.repeatTillMatch(
      { row: 'any' },
      { target: 'html', includes: '<span class="q2 b0">※ 文章網址: </span>' },
      () => { this.sendKey('PageDown'); },
    );
  }

  inArticleGotoPageBeginning() {
    return pttContent.repeatTillMatch({ row: 23 }, {
      target: 'html',
      regex: /class="q3 b5".*瀏覽\s*第\s*1\/\d+\s*頁/,
    },
    () => { this.sendText('0'); });
  }

  inArticleCollectPushLines() {
    const recCollect = async (collectedLines) => {
      const currentLines = [...pttContent.getBbsLines()]
        .map(line => line.cloneNode(true));

      const allLines = [...collectedLines, ...currentLines];

      if (pttContent.isPushsEnd) {
        return allLines;
      }
      this.sendKey('PageDown');
      await pttContent.waitChange();

      return recCollect(allLines);
    };

    return recCollect([]);
  }

  fromMainToPlayground() {
    this.sendText('P');
    this.sendKey('Enter');
    return pttContent.waitTil(() => (
      pttContent.matches(
        { row: 0 }, { target: 'text', includes: '【網路遊樂場】' },
      )
    ));
  }

  fromPlaygroundToStore() {
    this.sendText('P');
    this.sendKey('Enter');
    return pttContent.waitTil(() => (
      pttContent.matches(
        { row: 0 }, { target: 'text', includes: '【Ｐtt量販店】' },
      )
    ));
  }

  // ---- methods sent to controller ----

  sendText(...args) { return this.controller.sendText(...args); }

  sendKey(...args) { return this.controller.sendKey(...args); }
}

module.exports = Command;
