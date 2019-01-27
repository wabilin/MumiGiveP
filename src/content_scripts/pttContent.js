const getConentDiv = () => document.getElementById('mainContainer');
const getBbsLines = () => getConentDiv().querySelectorAll('[data-type="bbsline"]');

const waitChange = ({ timeout = 1000 } = {}) => {
  let mutated = false;
  const observer = new MutationObserver(() => {
    mutated = true;
  });
  const pttContentDiv = getConentDiv();
  observer.observe(pttContentDiv,
    { attributes: true, childList: true, subtree: true });

  const startedAt = (new Date()).getTime();

  return new Promise((resolve, reject) => {
    const run = () => {
      if (mutated) {
        observer.disconnect();
        return resolve(true);
      }

      const currentTime = (new Date()).getTime();
      if (currentTime - startedAt > timeout) {
        observer.disconnect();
        return reject(new Error('Wait for document mutation timeout.'));
      }

      setTimeout(run, 10);
    };

    setTimeout(run, 10);
  });
};

const dataForMatch = (element, targetType) => {
  if (targetType === 'text') {
    return element.innerText;
  } else if (targetType === 'html') {
    return element.innerHTML;
  } else {
    return element;
  }
}

const elementMatch = (element, options) => {
  const { target, func, includes } = options;
  const data = dataForMatch(element, target)
  if (func) {
    return func(data);
  }
  if (includes) {
    return data.includes(includes);
  }
}

const rowMatch = (rowIndex, options) => {
  const rows = getBbsLines()
  if (rowIndex === 'all') {
    return [...rows].some(row => elementMatch(row, options));
  } else {
    return elementMatch(rows[rowIndex], options);
  }
};

const contentMatch = (scope, matchOptions) => {
  const { row } = scope;
  if (row !== undefined) {
    return rowMatch(row, matchOptions);
  }
};

const repeatTillMatch = (scope, matchOptions, callback, options = {}) => {
  const { timeout = 30000, retry = 3 } = options;

  let retried = 0

  return new Promise((resolve, reject) => {
    const run = () => {
      if (contentMatch(scope, matchOptions)) {
        return resolve(true);
      }

      waitChange()
      .then(() => {
        retried = 0;
        run()
      })
      .catch((err) => {
        if (retried >= retry) { return reject(err) }

        retried += 1;
        setTimeout(run, 300)
      });

      callback();
    };

    run();
  });
};

module.exports = {
  getConentDiv,
  getBbsLines,
  waitChange,
  repeatTillMatch,
};
