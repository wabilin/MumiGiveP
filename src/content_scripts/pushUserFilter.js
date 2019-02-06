const { PushType } = require('./pushParser.js')

/**
 * @param { Array } pushInfos
 * @param { Object } settings
**/
function pushUserFilter(pushInfos, settings) {
  const filterAmount = (pushInfos) => {
    const sendAmount = Number(settings.get('sendAmount'))
    if (!sendAmount) { throw new Error('Amount not valid') }

    return pushInfos.slice(0, sendAmount);
  }

  const filterNFloors = (pushInfos) => {
    const n = Number(settings.get('nFloors'))
    if (!n) { throw new Error('nFloors not valid') }

    return pushInfos.filter((x, i) => i % n === 0)
  }

  const filterPushTypes = (pushInfos) => {
    const allowedTypes=  {
      [PushType.PUSH]: settings.get('push'),
      [PushType.BOO]: settings.get('boo'),
      [PushType.ARROW]: settings.get('arrow'),
    }

    return pushInfos.filter(x => allowedTypes[x.type])
  }


  let filtered = filterPushTypes(pushInfos);
  filtered = filterNFloors(filtered)
  return filterAmount(filtered).map(x => x.id)
};

module.exports = pushUserFilter;
