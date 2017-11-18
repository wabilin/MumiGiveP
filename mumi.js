let getPttChrome = () => {
  return window.wrappedJSObject.pttchrome.app;
};

let arrowLeft = () => {
  ptt.conn.send('\x1b[D');
};

// setInterval(arrowLeft, 3000);

let getBbsLines = () => {
  return document.querySelectorAll('[data-type="bbsline"]');
};

let all_span = $("span:not(:has(*))");
all_span.each(function(i) {
  let x = $(this);
  t = 'mumi'+ x.text();
});

let pushTypes = {
  PUSH: 1,
  ARROW: 2,
  BOO: 3
};

let parsePushData = (line) => {
  if (!isPushLine(line)) {
    return null;
  }

  let head = line.children[0];
  let id = line.children[1].children[0].innerHTML;
  
  let pushType = pushTypes.ARROW;
  if (isPush(head)) {
    pushType = pushTypes.PUSH;
  } else if (isBoo(head)) {
    pushType = pushTypes.ARROW;
  }

  return {
    pushType: pushType,
    id: id
  }
};

let matchClassAndHtml = (ele, cName, html) => {
  return ele.className === cName && ele.innerHTML === html;
};

let isPush =  (span) => matchClassAndHtml(span, "q15 b0", "<span>推 </span>"); 
let isArrow = (span) => matchClassAndHtml(span, "q9 b0", "<span>→ </span>"); 
let isBoo =   (span) => matchClassAndHtml(span, "q9 b0", "<span>噓 </span>");

let matchIdRule = (id) => {
  let re = /^[A-z][A-z0-9]{3,}$/;
  return re.test(id);
};

let isPushLine = (line) => {
  if(! 'children' in line || ! 'length' in line.children ||
    line.children.length !== 4) {
    return false;
  }
  
  let head = line.children[0];
  let id = line.children[1].children[0].innerHTML;

  return (isPush(head) || isArrow(head) || isBoo(head)) && matchIdRule(id);
};

