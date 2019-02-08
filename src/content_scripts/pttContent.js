// @flow

const getContentDiv = () => document.getElementById('mainContainer');
const buildEmptyList = () => document.createDocumentFragment().querySelectorAll('#none');

const getBbsLines = (): NodeList<HTMLElement> => {
  const content = getContentDiv();
  if (content === null) {
    return buildEmptyList();
  }

  return content.querySelectorAll('[data-type="bbsline"]');
};
const currentTime = () => (new Date()).getTime();

const waitChange = ({ timeout = 1000 } : {timeout: number} = {}) => {
  let mutated = false;
  const observer = new MutationObserver(() => {
    mutated = true;
  });

  const pttContentDiv = getContentDiv();
  if (pttContentDiv === null) {
    throw new Error('PTT Content div not found');
  }
  observer.observe(pttContentDiv,
    { attributes: true, childList: true, subtree: true });

  const startedAt = currentTime();

  return new Promise<void>((resolve, reject) => {
    const run = () => {
      if (mutated) {
        observer.disconnect();
        return resolve();
      }

      if (currentTime() - startedAt > timeout) {
        observer.disconnect();
        return reject(new Error('等待刷新內容逾時'));
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
const waitTil = (isDone: () => boolean, { timeout = 3000 } : {timeout: number} = {}) => {
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
const dataForMatch = (element: HTMLElement, targetType: string) => {
  if (targetType === 'text') {
    return element.textContent;
  } if (targetType === 'html') {
    return element.innerHTML;
  }
  return element;
};

type MatchOpt = {
  target: string,
  func?: (HTMLElement | string) => boolean,
  includes?: string,
  regex?: RegExp,
};

type MatchScope = {
  row: number|string,
};

const elementMatch = (element, options: MatchOpt): boolean => {
  const {
    target, func, includes, regex,
  } = options;
  const data = dataForMatch(element, target);

  if (func) { return func(data); }

  if (typeof data === 'string') {
    if (includes) { return data.includes(includes); }
    if (regex && data) {
      const ok = regex.test(data);
      return ok;
    }
  }

  throw new Error('Unknown option or data type');
};

const rowMatch = (rowIndex, options: MatchOpt) => {
  const rows = getBbsLines();
  if (rowIndex === 'any') {
    return [...rows].some(row => elementMatch(row, options));
  } if (typeof rowIndex !== 'number') {
    throw new Error('Unexpected index');
  }

  return elementMatch(rows[rowIndex], options);
};

const matches = (
  scope: MatchScope, matchOptions: MatchOpt,
): boolean => rowMatch(scope.row, matchOptions);

const repeatTillMatch = (
  scope: MatchScope, matchOptions: MatchOpt,
  callback: (...args: Array<mixed>) => mixed,
  { timeout = 30000, retry = 3 }: {timeout: number, retry: number} = {},
) => {
  const startedAt = currentTime();
  let retried = 0;

  return new Promise<void>((resolve, reject) => {
    const run = () => {
      if (matches(scope, matchOptions)) {
        return resolve();
      }

      if (currentTime() - startedAt > timeout) {
        return reject(new Error('Timeout at repeatTillMatch'));
      }

      waitChange()
        .then(() => {
          retried = 0;
          return run();
        })
        .catch((err: Error) => {
          if (retried >= retry) { return reject(err); }

          retried += 1;
          return setTimeout(run, 300);
        });

      return callback();
    };

    run();
  });
};


export {
  getContentDiv,
  getBbsLines,
  waitChange,
  waitTil,
  matches,
  repeatTillMatch,
};
