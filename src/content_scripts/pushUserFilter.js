// @flow

import uniqBy from 'lodash/uniqBy';
import { PushType } from './pushParser';
import type { PushInfo } from './pushParser';

type PushInfoList = Array<PushInfo>;
export type FilterSetting = {
  sendAmount: ?(string | number),
  nFloors: ?(string | number),
  startFloor: ?(string | number),

  push: ?(string | boolean),
  boo: ?(string | boolean),
  arrow: ?(string | boolean),

  pttId: ?string,
  commentContains: ?string,
  uniqUserId: ?boolean,
};

function pushUserFilter(
  pushInfos: PushInfoList, settings: FilterSetting,
): Array<string> {
  const filterAmount = (pushs): PushInfoList => {
    const sendAmount = Number(settings.sendAmount);
    if (!sendAmount) { throw new Error('Amount not valid'); }

    return pushs.slice(0, sendAmount);
  };

  const filterNFloors = (pushs) => {
    const n = Number(settings.nFloors);
    if (!n) { throw new Error('nFloors not valid'); }

    return pushs.filter((x, i) => i % n === 0);
  };

  const filterPushTypes = (pushs): PushInfoList => {
    const allowedTypes = {
      [PushType.PUSH]: settings.push,
      [PushType.BOO]: settings.boo,
      [PushType.ARROW]: settings.arrow,
    };

    return pushs.filter((x) => allowedTypes[x.type]);
  };

  const filterUniqIds = (pushs): PushInfoList => {
    if (settings.uniqUserId) {
      return uniqBy(pushs, (info) => info.id);
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

    return pushs.filter((x) => x.id !== pttId);
  };

  const filterCommentContains = (pushs) => {
    const { commentContains } = settings;
    if (!commentContains) { return pushs; }

    return pushs.filter((x) => x.raw.includes(commentContains));
  };

  let filtered = pushInfos;
  filtered = filterStartFloor(filtered);
  filtered = filterPttId(filtered);
  filtered = filterCommentContains(filtered);
  filtered = filterPushTypes(filtered);
  filtered = filterUniqIds(filtered);
  filtered = filterNFloors(filtered);
  filtered = filterAmount(filtered);
  return filtered.map((x) => x.id);
}

export default pushUserFilter;
