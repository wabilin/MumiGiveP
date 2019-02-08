import _ from 'lodash';

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

const pushLineFormat = (line) => {
  const { children } = line;
  if (!(children && children.length && children.length >= 1)) {
    return null;
  }

  const idSpan = children[0];
  return idSpan
    && ('children' in idSpan)
    && ('length' in idSpan.children)
    && (idSpan.children.length >= 3);
};

const matchIdRule = (id) => {
  if (!id) {
    return false;
  }

  const re = /^[A-Za-z][A-Za-z0-9]{3,}$/;
  return re.test(id);
};

const parsePushData = (line) => {
  if (!pushLineFormat(line)) { return null; }
  const headSpan = line.children[0];

  const type = pushType(headSpan.children[0]);
  const id = headSpan.children[1].innerHTML;

  if (!type || !matchIdRule(id)) { return null; }

  return {
    type,
    id,
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
  const pushInfos = linesUnderArticle.map(parsePushData).filter(x => x);
  const uniqPushInfos = _.uniqBy(pushInfos,
    info => info.raw.replace(/\s/g, ''));
  return uniqPushInfos;
};

export { PushType, parsePushData, getPushInfos };
