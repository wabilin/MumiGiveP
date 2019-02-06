const _ = require('lodash');
const { PushType } = require('./pushParser.js');

/**
 * @param { Array } pushInfos
 * @param { Object } settings
* */
function pushUserFilter(pushInfos, settings) {
  const filterAmount = (pushs) => {
    const sendAmount = Number(settings.get('sendAmount'));
    if (!sendAmount) { throw new Error('Amount not valid'); }

    return pushs.slice(0, sendAmount);
  };

  const filterNFloors = (pushs) => {
    const n = Number(settings.get('nFloors'));
    if (!n) { throw new Error('nFloors not valid'); }

    return pushs.filter((x, i) => i % n === 0);
  };

  const filterPushTypes = (pushs) => {
    const allowedTypes = {
      [PushType.PUSH]: settings.get('push'),
      [PushType.BOO]: settings.get('boo'),
      [PushType.ARROW]: settings.get('arrow'),
    };

    return pushs.filter(x => allowedTypes[x.type]);
  };

  const filterUniqIds = (pushs) => {
    if (settings.get('uniqUserId')) {
      return _.uniqBy(pushs, info => info.id);
    }
    return pushs;
  };

  let filtered = filterPushTypes(pushInfos);
  filtered = filterUniqIds(filtered);
  filtered = filterNFloors(filtered);
  return filterAmount(filtered).map(x => x.id);
}

module.exports = pushUserFilter;
