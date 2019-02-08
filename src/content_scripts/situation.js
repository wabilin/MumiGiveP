// @flow

import { matches } from './pttContent';

const HEAD = { row: 0 };
const FOOT = { row: 23 };

export const isInArticle = () => matches(FOOT, {
  target: 'text',
  regex: /瀏覽\s*第\s*\d+\/\d+\s*頁/,
});

export const isPushsEnd = () => matches(FOOT, {
  target: 'text',
  includes: '(100%)',
});

export const isInPttStore = () => matches(HEAD, {
  target: 'text',
  includes: '【Ｐtt量販店】',
});

export const isAskingPassword = () => matches({ row: 'any' }, {
  target: 'text',
  includes: '請輸入您的密碼',
});

export const isInvalidPassword = () => matches(FOOT, {
  target: 'text',
  includes: '密碼錯誤',
});

export const isAskingMoneyAmount = () => matches(
  { row: 3 },
  { target: 'text', includes: '請輸入金額' },
);

export const isTransactionCanceled = () => matches(
  { row: 23 },
  { target: 'text', includes: '交易取消' },
);

export const isConfirmingTransaction = () => matches(FOOT, {
  target: 'text',
  includes: '確定進行交易嗎',
});

export const isAskingEditRedEnvelope = () => matches(FOOT, {
  target: 'text',
  includes: '交易已完成，要修改紅包袋嗎',
});

export const isTransactionFinished = () => matches(FOOT, {
  target: 'text',
  includes: '◆ 交易完成',
});
