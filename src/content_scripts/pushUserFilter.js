const _ = require('lodash');
const { PushType } = require('./pushParser.js');

/**
 * @param { Array } pushInfos
 * @param { Object } settings
* */
function pushUserFilter(pushInfos, settings) {
  const filterAmount = (pushs) => {
    const sendAmount = Number(settings.sendAmount);
    if (!sendAmount) { throw new Error('Amount not valid'); }

    return pushs.slice(0, sendAmount);
  };

  const filterNFloors = (pushs) => {
    const n = Number(settings.nFloors);
    if (!n) { throw new Error('nFloors not valid'); }

    return pushs.filter((x, i) => i % n === 0);
  };

  const filterPushTypes = (pushs) => {
    const allowedTypes = {
      [PushType.PUSH]: settings.push,
      [PushType.BOO]: settings.boo,
      [PushType.ARROW]: settings.arrow,
    };

    return pushs.filter(x => allowedTypes[x.type]);
  };

  const filterUniqIds = (pushs) => {
    if (settings.uniqUserId) {
      return _.uniqBy(pushs, info => info.id);
    }
    return pushs;
  };

  const filterStartFloor = (pushs) => {
    const startFloor = Number(settings.startFloor);
    if (!Number.isInteger(startFloor) || startFloor < 1) {
      throw new Error('起始樓層設定錯誤。');
    }

    return pushs.slice(startFloor - 1);
  };

  const filterPttId = (pushs) => {
    const { pttId } = settings;
    if (!pttId) { return pushs; }

    return pushs.filter(x => x.id !== pttId);
  };

  let filtered = pushInfos;
  filtered = filterStartFloor(filtered);
  filtered = filterPttId(filtered);
  filtered = filterPushTypes(filtered);
  filtered = filterUniqIds(filtered);
  filtered = filterNFloors(filtered);
  return filterAmount(filtered).map(x => x.id);
}

module.exports = pushUserFilter;
