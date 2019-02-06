const _ = require('lodash');

const PushType = {
  PUSH: 'PUSH',
  ARROW: 'ARROW',
  BOO: 'BOO',
};

const matchClassAndHtml = (ele, className, html) => (
  ele.className === className && ele.innerHTML === html
);

const isPush = span => matchClassAndHtml(span, 'q15 b0', '推 ');
const isArrow = span => matchClassAndHtml(span, 'q9 b0', '→ ');
const isBoo = span => matchClassAndHtml(span, 'q9 b0', '噓 ');
const typeDetectors = {
  [PushType.PUSH]: isPush,
  [PushType.ARROW]: isArrow,
  [PushType.BOO]: isBoo,
};

const pushType = (span) => {
  const matched = Object.entries(typeDetectors)
    .find(([, isType]) => isType(span));

  return matched ? matched[0] : null;
};

const pushLineFormat = lineSpan => (
  lineSpan
  && ('children' in lineSpan)
  && ('length' in lineSpan.children)
  && (lineSpan.children.length >= 3));

const matchIdRule = (id) => {
  if (!id) {
    return false;
  }

  const re = /^[A-Za-z][A-Za-z0-9]{3,}$/;
  return re.test(id);
};

const parsePushData = (line) => {
  if (!pushLineFormat(line)) { return null; }

  const type = pushType(line.children[0]);
  const [, id, comment, timestamp] = [...line.children].map(x => x.innerHTML);

  if (!type || !matchIdRule(id)) { return null; }

  return {
    type,
    id,
    comment,
    timestamp,
    raw: line.innerHTML,
  };
};

const filterLinesUnderArticle = (lines) => {
  const articleEndIndex = lines.findIndex(line => (
    line.innerHTML.includes('<span class="q2 b0">※ 文章網址: </span>')
  ));

  if (!articleEndIndex) {
    throw new Error('Line "文章網址" not found.');
  }

  return lines.slice(articleEndIndex);
};

const getPushInfos = (rawLines) => {
  const linesUnderArticle = filterLinesUnderArticle(rawLines);
  const innerSpans = linesUnderArticle.map(raw => raw.children && raw.children[0]);
  const pushInfos = innerSpans.map(parsePushData).filter(x => x);
  const uniqPushInfos = _.uniqBy(pushInfos, info => info.raw);
  return uniqPushInfos;
};


module.exports = { PushType, parsePushData, getPushInfos };
