import pushUserFilter from './pushUserFilter';

// Example data from: https://www.ptt.cc/bbs/PlayStation/M.1503932148.A.4D4.html
function getExamplePushs() {
  return [
    {
      type: 'PUSH',
      id: 'hipposman',
      raw: '<span><span class="q15 b0">推 </span><span class="q11 b0">hipposman</span><span class="q3 b0">: 這就是專業                                           </span><span class="q7 b0">08/28 22:57  </span></span>',
    },
    {
      type: 'PUSH',
      id: 'eva05s',
      raw: '<span><span class="q15 b0">推 </span><span class="q11 b0">eva05s</span><span class="q3 b0">: 沒錯，還有小正太                                        </span><span class="q7 b0">08/28 22:57  </span></span>',
    },
    {
      type: 'PUSH',
      id: 'fiendeo',
      raw: '<span><span class="q15 b0">推 </span><span class="q11 b0">fiendeo</span><span class="q3 b0">: 好期待！！我是明天晚上場的 &gt; &lt;                         </span><span class="q7 b0">08/28 23:00  </span></span>',
    },
    {
      type: 'PUSH',
      id: 'iamnotgm',
      raw: '<span><span class="q15 b0">推 </span><span class="q11 b0">iamnotgm</span><span class="q3 b0">: 就說很多人被9S和亞當夏娃拉進來阿XDDD                  </span><span class="q7 b0">08/28 23:01  </span></span>',
    },
    {
      type: 'ARROW',
      id: 'danielwoody',
      raw: '<span><span class="q9 b0">→ </span><span class="q11 b0">danielwoody</span><span class="q3 b0">: 請問現場是有販賣週邊嗎？                           </span><span class="q7 b0">08/28 23:06  </span></span>',
    },
    {
      type: 'ARROW',
      id: 'aaronpwyu',
      raw: '<span><span class="q9 b0">→ </span><span class="q11 b0">aaronpwyu</span><span class="q3 b0">: 場地很爛是基本的 XD                                  </span><span class="q7 b0">08/28 23:07  </span></span>',
    },
    {
      type: 'PUSH',
      id: 'kuku321',
      raw: '<span><span class="q15 b0">推 </span><span class="q11 b0">kuku321</span><span class="q3 b0">: </span></span><a class="y" href="http://tinyurl.com/yco7zl6n" rel="noreferrer" target="_blank"><span class="q3 b0">http://tinyurl.com/yco7zl6n</span></a><span><span class="q3 b0">                            </span><span class="q7 b0">08/28 23:10  </span></span>',
    },
    {
      type: 'ARROW',
      id: 'kuku321',
      raw: '<span><span class="q9 b0">→ </span><span class="q11 b0">kuku321</span><span class="q3 b0">: 是悠木碧堅持要去台灣才讓她出現一天的XDDD               </span><span class="q7 b0">08/28 23:11  </span></span>',
    },
    {
      type: 'PUSH',
      id: 'ice6',
      raw: '<span><span class="q15 b0">推 </span><span class="q11 b0">ice6</span><span class="q3 b0">: 有，但是只有持當日場次門票者限購一次，買之前要先想好      </span><span class="q7 b0">08/28 23:15  </span></span>',
    },
    {
      type: 'PUSH',
      id: 'cwr5',
      raw: '<span><span class="q15 b0">推 </span><span class="q11 b0">cwr5</span><span class="q3 b0">: 有去，那個重低音喇叭把Emi Evans的歌聲都蓋掉了……         </span><span class="q7 b0">08/28 23:28  </span></span>',
    },
    {
      type: 'PUSH',
      id: 'hoshino1219',
      raw: '<span><span class="q15 b0">推 </span><span class="q11 b0">hoshino1219</span><span class="q3 b0">: 螢幕字幕速度差的是蠻多的…囧                       </span><span class="q7 b0">08/28 23:30  </span></span>',
    },
    {
      type: 'PUSH',
      id: 'slainshadow',
      raw: '<span><span class="q15 b0">推 </span><span class="q11 b0">slainshadow</span><span class="q3 b0">: 悠木也是在幾乎緊湊的行程表裡擠出時間來的...之前是  </span><span class="q7 b0">08/28 23:31  </span></span>',
    },
    {
      type: 'ARROW',
      id: 'slainshadow',
      raw: '<span><span class="q9 b0">→ </span><span class="q11 b0">slainshadow</span><span class="q3 b0">: 不是有人說行程滿的(?                               </span><span class="q7 b0">08/28 23:31  </span></span>',
    },
    {
      type: 'PUSH',
      id: 'kuku321',
      raw: '<span><span class="q15 b0">推 </span><span class="q11 b0">kuku321</span><span class="q3 b0">: </span></span><a class="y" href="https://www.4gamers.com.tw/news/detail/33017/" rel="noreferrer" target="_blank"><span class="q3 b0">https://www.4gamers.com.tw/news/detail/33017/</span></a><span><span class="q3 b0">          </span><span class="q7 b0">08/28 23:45  </span></span>',
    },
    {
      type: 'ARROW',
      id: 'kuku321',
      raw: '<span><span class="q9 b0">→ </span><span class="q11 b0">kuku321</span><span class="q3 b0">: 4GAMERS的專訪也可以看一下 最後一段真的會笑死           </span><span class="q7 b0">08/28 23:45  </span></span>',
    },
    {
      type: 'ARROW',
      id: 'kuku321',
      raw: '<span><span class="q9 b0">→ </span><span class="q11 b0">kuku321</span><span class="q3 b0">: "買了水貨可以退" 橫尾真的是擅長講幹話的朋友XDDD        </span><span class="q7 b0">08/28 23:46  </span></span>',
    },
    {
      type: 'ARROW',
      id: 'kuku321',
      raw: '<span><span class="q9 b0">→ </span><span class="q11 b0">kuku321</span><span class="q3 b0">: 齋藤P:(擦汗中                                          </span><span class="q7 b0">08/28 23:46  </span></span>',
    },
    {
      type: 'PUSH',
      id: 'weiweiut',
      raw: '<span><span class="q15 b0">推 </span><span class="q11 b0">weiweiut</span><span class="q3 b0">: 很不喜歡工作人員在演奏的時候走來走去... ，幾乎每首曲  </span><span class="q7 b0">08/28 23:52  </span></span>',
    },
    {
      type: 'ARROW',
      id: 'weiweiut',
      raw: '<span><span class="q9 b0">→ </span><span class="q11 b0">weiweiut</span><span class="q3 b0">: 子都有工作人員走動                                    </span><span class="q7 b0">08/28 23:52  </span></span>',
    },
    {
      type: 'PUSH',
      id: 'Kamikiri',
      raw: '<span><span class="q15 b0">推 </span><span class="q11 b0">Kamikiri</span><span class="q3 b0">: 尼爾的歌都是造語  蠻好奇歌詞表是怎麼標發音的          </span><span class="q7 b0">08/29 00:13  </span></span>',
    },
    {
      type: 'PUSH',
      id: 'takam',
      raw: '<span><span class="q15 b0">推 </span><span class="q11 b0">takam</span><span class="q3 b0">: 這場地非常不適合這種類型的音樂會啊XD                     </span><span class="q7 b0">08/29 00:17  </span></span>',
    },
  ];
}

const DEFAULT_ATTRS = Object.freeze({
  startFloor: '1',
  sendAmount: '2',
  nFloors: 1,
  push: 'on',
  boo: 'on',
  arrow: 'on',
});

function settting(attrs) {
  return { ...DEFAULT_ATTRS, ...attrs };
}

describe('pushUserFilter', () => {
  it('filter by sendAmount', () => {
    const filtered = pushUserFilter(
      getExamplePushs(),
      settting({ sendAmount: '3' }),
    );

    expect(filtered).toEqual([
      'hipposman', 'eva05s', 'fiendeo',
    ]);
  });

  it('filter by nFloors', () => {
    const filtered = pushUserFilter(
      getExamplePushs(),
      settting({ nFloors: '2' }),
    );

    expect(filtered).toEqual([
      'hipposman', 'fiendeo',
    ]);
  });

  it('filter by push', () => {
    const filtered = pushUserFilter(
      getExamplePushs(),
      settting({ push: '' }),
    );

    expect(filtered).toEqual([
      'danielwoody', 'aaronpwyu',
    ]);
  });

  it('filter by boo', () => {
    const example = getExamplePushs();
    example[0].type = 'BOO';

    const filtered = pushUserFilter(
      example,
      settting({ boo: '' }),
    );

    expect(filtered).toEqual([
      'eva05s', 'fiendeo',
    ]);
  });

  it('filter by arrow', () => {
    const filtered = pushUserFilter(
      getExamplePushs(),
      settting({ arrow: '', sendAmount: '5' }),
    );

    expect(filtered[4]).toEqual('kuku321');
  });

  it('filter by uniqUserId', () => {
    const filtered = pushUserFilter(
      getExamplePushs(),
      settting({ uniqUserId: 'on', sendAmount: '20' }),
    );

    expect(filtered.length).toEqual(
      (new Set(filtered)).size,
    );
  });

  it('filter by startFloor', () => {
    const filtered = pushUserFilter(
      getExamplePushs(),
      settting({ startFloor: '3' }),
    );

    expect(filtered).toEqual([
      'fiendeo', 'iamnotgm',
    ]);
  });

  it('filter by pttId', () => {
    const filtered = pushUserFilter(
      getExamplePushs(),
      settting({ pttId: 'hipposman' }),
    );

    expect(filtered).toEqual([
      'eva05s', 'fiendeo',
    ]);
  });

  it('filter by commentContains', () => {
    const filtered = pushUserFilter(
      getExamplePushs(),
      settting({ commentContains: '悠木碧' }),
    );

    expect(filtered).toEqual([
      'kuku321',
    ]);
  });

  it('filter by multi options', () => {
    const filtered = pushUserFilter(
      getExamplePushs(),
      settting({
        push: '',
        arrow: 'on',
        nFloors: '3',
        sendAmount: '2',
      }),
    );

    expect(filtered).toEqual(['danielwoody', 'slainshadow']);
  });
});
