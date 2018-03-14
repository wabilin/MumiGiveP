const getPttChrome = () => {
  const win = window.wrappedJSObject || window;
  return win.pttchrome.app;
};

const arrowLeft = () => {
  const ptt = getPttChrome();
  ptt.conn.send('\x1b[D');
};

const getBbsLines = () => {
  return document.querySelectorAll('[data-type="bbsline"]');
};

const pushTypes = {
  PUSH: 1,
  ARROW: 2,
  BOO: 3
};

const pushType = (span) => {
  const matchClassAndHtml = (ele, cName, html) => {
    return ele.className === cName && ele.innerHTML === html;
  };

  const isPush =  (span) => matchClassAndHtml(span, "q15 b0", "<span>推 </span>");
  const isArrow = (span) => matchClassAndHtml(span, "q9 b0", "<span>→ </span>");
  const isBoo =   (span) => matchClassAndHtml(span, "q9 b0", "<span>噓 </span>");
  const typeDetectors = { 1: isPush, 2: isArrow, 3: isBoo };

  for (let key of Object.keys(typeDetectors)) {
    const detector = typeDetectors[key];
    if (detector(span)) {
      return key;
    }
  }

  return null;
};

const pushLineFormat = (line) => {
  return ('children' in line) && ('length' in line.children) &&
    (line.children.length === 4);
};

const matchIdRule = (id) => {
  if (!id) {
    return false;
  }
  const re = /^[A-z][A-z0-9]{3,}$/;
  return re.test(id);
};

const parsePushData = (line) => {
  if (!pushLineFormat(line)) {
    return null;
  }

  const head_span = line.children[0];
  const type = pushType(head_span);

  const idSpan = line.children[1];
  const id = idSpan && idSpan.children[0] && idSpan.children[0].innerHTML;

  if (!type || !matchIdRule(id)) {
    return null;
  }

  return {
    pushType: pushType,
    id: id
  };
};

const listener = (request, sender, sendResponse) => {
  console.log('mumi!!');
  arrowLeft();
};
if (chrome) {
  browser = chrome;
}
browser.runtime.onMessage.addListener(listener);
