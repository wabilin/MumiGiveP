const pttContent = require('./pttContent');
const pushParser = require('./pushParser');
const situation = require('./situation');

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
    if (!situation.isInArticle()) {
      throw new Error('Not in an article');
    }

    await this.inArticleGotoPageBeginning();
    await this.inArticleGotoArticleEnding();

    const collectedLines = await this.inArticleCollectPushLines();

    return pushParser.getPushInfos(collectedLines);
  }

  async gotoPttStore() {
    if (situation.isInPttStore()) { return true; }

    await this.gotoMainPage();

    await this.fromMainToPlayground();

    return this.fromPlaygroundToStore();
  }

  async giveMoneyTo(id, amount, password) {
    await this.gotoPttStore();

    this.sendText('0');
    this.sendKey('Enter');

    await pttContent.waitTil(() => pttContent.matches(
      { row: 0 }, { target: 'text', includes: '【 給予Ptt幣 】' },
    ));


    this.sendText(id);
    this.sendKey('Enter');

    await pttContent.waitTil(() => pttContent.matches(
      { row: 3 }, { target: 'text', includes: '請輸入金額' },
    ));

    this.sendText(String(amount));
    this.sendKey('Enter');

    await pttContent.waitTil(() => situation.isAskingPassword()
      || situation.isConfirmingTransaction());

    if (situation.isAskingPassword()) {
      this.sendText(password);
      this.sendKey('Enter');
    }

    await pttContent.waitTil(() => (
      situation.isInvalidPassword()
      || situation.isConfirmingTransaction()
    ), { timeout: 10000 });

    if (situation.isInvalidPassword()) {
      throw new Error('Invalid Password');
    } else {
      // 'y' for 確定進行交易嗎？
      this.sendText('y');
      this.sendKey('Enter');
    }

    await pttContent.waitTil(
      () => situation.isAskingEditRedEnvelope(),
      { timeout: 10000 },
    );
    this.sendText('n');
    this.sendKey('Enter');

    await pttContent.waitTil(() => situation.isTransactionFinished());

    return true;
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

      if (situation.isPushsEnd) {
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
