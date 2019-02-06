const getConentDiv = () => document.getElementById('mainContainer');
const getBbsLines = () => getConentDiv().querySelectorAll('[data-type="bbsline"]');
const currentTime = () => (new Date()).getTime();

const waitChange = ({ timeout = 1000 } = {}) => {
  let mutated = false;
  const observer = new MutationObserver(() => {
    mutated = true;
  });
  const pttContentDiv = getConentDiv();
  observer.observe(pttContentDiv,
    { attributes: true, childList: true, subtree: true });

  const startedAt = currentTime();

  return new Promise((resolve, reject) => {
    const run = () => {
      if (mutated) {
        observer.disconnect();
        return resolve(true);
      }

      if (currentTime() - startedAt > timeout) {
        observer.disconnect();
        return reject(new Error('Wait for document mutation timeout.'));
      }

      return setTimeout(run, 10);
    };

    setTimeout(run, 10);
  });
};

/**
 * @param {Function} isDone
 * @param {Object} options
 * @param {number} options.timeout
 */
const waitTil = (isDone, { timeout = 3000 } = {}) => {
  const startedAt = currentTime();

  const recWait = async () => {
    if (isDone()) { return true; }

    if (currentTime() - startedAt > timeout) {
      throw new Error('Timeout');
    }

    await waitChange({ timeout });
    return recWait();
  };

  return recWait();
};

/**
 * @param {Object} element - A DOM element
 * @param {string} targetType - 'text', 'html' or 'raw'
 */
const dataForMatch = (element, targetType) => {
  if (targetType === 'text') {
    return element.textContent;
  } if (targetType === 'html') {
    return element.innerHTML;
  }
  return element;
};

const elementMatch = (element, options) => {
  const {
    target, func, includes, regex,
  } = options;
  const data = dataForMatch(element, target);

  if (func) { return func(data); }
  if (includes) { return data.includes(includes); }
  if (regex) {
    const ok = regex.test(data);
    return ok;
  }

  throw new Error('Unknown option');
};

/**
 * @param {number | string} rowIndex - 'any' or number in 0..23
 * @param {Object} options
 */
const rowMatch = (rowIndex, options) => {
  const rows = getBbsLines();
  if (rowIndex === 'any') {
    return [...rows].some(row => elementMatch(row, options));
  }
  return elementMatch(rows[rowIndex], options);
};

const matches = (scope, matchOptions) => {
  const { row } = scope;
  if (row !== undefined) {
    return rowMatch(row, matchOptions);
  }
  throw new Error('Undefined match params');
};

const repeatTillMatch = (scope, matchOptions, callback, options = {}) => {
  const { timeout = 30000, retry = 3 } = options;

  const startedAt = currentTime();
  let retried = 0;

  return new Promise((resolve, reject) => {
    const run = () => {
      if (matches(scope, matchOptions)) {
        return resolve(true);
      }

      if (currentTime() - startedAt > timeout) {
        return reject(new Error('Timeout at repeatTillMatch'));
      }

      waitChange()
        .then(() => {
          retried = 0;
          return run();
        })
        .catch((err) => {
          if (retried >= retry) { return reject(err); }

          retried += 1;
          return setTimeout(run, 300);
        });

      return callback();
    };

    run();
  });
};


module.exports = {
  getConentDiv,
  getBbsLines,
  waitChange,
  waitTil,
  matches,
  repeatTillMatch,
};
