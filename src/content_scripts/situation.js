const { matches } = require('./pttContent');

const HEAD = { row: 0 };
const FOOT = { row: 23 };

module.exports = {
  isInArticle() {
    return matches(FOOT, {
      target: 'text',
      regex: /瀏覽\s*第\s*\d+\/\d+\s*頁/,
    });
  },

  isPushsEnd() {
    return matches(FOOT, {
      target: 'text',
      includes: '(100%)',
    });
  },

  isInPttStore() {
    return matches(HEAD, {
      target: 'text',
      includes: '【Ｐtt量販店】',
    });
  },

  isAskingPassword() {
    return matches({ row: 'any' }, {
      target: 'text',
      includes: '請輸入您的密碼',
    });
  },

  isInvalidPassword() {
    return matches(FOOT, {
      target: 'text',
      includes: '密碼錯誤',
    });
  },

  isAskingMoneyAmount() {
    return matches(
      { row: 3 },
      { target: 'text', includes: '請輸入金額' },
    )
  },

  isTransactionCanceled() {
    return matches(
      { row: 23 },
      { target: 'text', includes: '交易取消' },
    )
  },

  isConfirmingTransaction() {
    return matches(FOOT, {
      target: 'text',
      includes: '確定進行交易嗎',
    });
  },

  isAskingEditRedEnvelope() {
    return matches(FOOT, {
      target: 'text',
      includes: '交易已完成，要修改紅包袋嗎',
    });
  },

  isTransactionFinished() {
    return matches(FOOT, {
      target: 'text',
      includes: '◆ 交易完成',
    });
  },
};
