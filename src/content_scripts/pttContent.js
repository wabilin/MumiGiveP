const getConentDiv = () => document.getElementById('mainContainer');
const getBbsLines = () => getConentDiv().querySelectorAll('[data-type="bbsline"]');

const waitChange = ({ timeout = 3000 } = {}) => {
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

    run();
  });
};

const rowMatch = (rowIndex, options) => {
  const row = getBbsLines()[rowIndex];
  const { func, textIncluded } = options;
  if (func) {
    return func(row);
  } if (textIncluded) {
    return row.innerText.includes(textIncluded);
  }
};

const contentMatch = (scope, matchOptions) => {
  const { row } = scope;
  if (row !== undefined) {
    return rowMatch(row, matchOptions);
  }
};

const repeatTillMatch = (scope, matchOptions, callback, options = {}) => {
  const { timeout = 30000 } = options;

  return new Promise((resolve, reject) => {
    const run = () => {
      if (contentMatch(scope, matchOptions)) {
        resolve(true);
      } else {
        callback();
        waitChange().then(run).catch(reject);
      }
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
