// @flow
import _ from 'lodash';

const PushType = {
  PUSH: 'PUSH',
  ARROW: 'ARROW',
  BOO: 'BOO',
};

const matchClassAndHtml = (
  ele: HTMLElement, className: string, html: string,
) => (
  ele.className === className && ele.innerHTML === html
);

const isPush = (span: HTMLElement) => matchClassAndHtml(span, 'q15 b0', '推 ');
const isArrow = (span: HTMLElement) => matchClassAndHtml(span, 'q9 b0', '→ ');
const isBoo = (span: HTMLElement) => matchClassAndHtml(span, 'q9 b0', '噓 ');

const pushType = (span: HTMLElement) => {
  if (isPush(span)) { return PushType.PUSH; }
  if (isArrow(span)) { return PushType.ARROW; }
  if (isBoo(span)) { return PushType.BOO; }

  return null;
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


export type PushInfo = {
  type: string,
  id: string,
  raw: string,
};
const parsePushData = (line: HTMLElement): PushInfo | null => {
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

const filterLinesUnderArticle = (lines: Array<HTMLElement>) => {
  const articleEndIndex = lines.findIndex(line => (
    line.innerHTML.includes('<span class="q2 b0">※ 文章網址: </span>')
  ));

  if (!articleEndIndex) {
    throw new Error('Line "文章網址" not found.');
  }

  return lines.slice(articleEndIndex);
};

const getPushInfos = (rawLines: Array<HTMLElement>): Array<PushInfo> => {
  const linesUnderArticle = filterLinesUnderArticle(rawLines);
  const pushInfos = linesUnderArticle.map(parsePushData).filter(x => x);
  const uniqPushInfos = _.uniqBy(pushInfos,
    info => info.raw.replace(/\s/g, ''));
  return uniqPushInfos;
};

export { PushType, parsePushData, getPushInfos };
