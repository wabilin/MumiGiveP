const pushUserFilter = require('./pushUserFilter')

describe('pushUserFilter', () => {
  it('filter by sendAmount', () => {
    const filtered = pushUserFilter(
      getExamplePushs(),
      settting({ sendAmount: '3' }),
    );

    expect(filtered).toEqual([
      "hipposman", "eva05s", "fiendeo",
    ])
  })

  it('filter by nFloors', () => {
    const filtered = pushUserFilter(
      getExamplePushs(),
      settting({ nFloors: '2' }),
    );

    expect(filtered).toEqual([
      "hipposman", "fiendeo",
    ])
  })

  it('filter by push', () => {
    const filtered = pushUserFilter(
      getExamplePushs(),
      settting({ push: '' }),
    );

    expect(filtered).toEqual([
      "danielwoody", "aaronpwyu",
    ])
  })

  it('filter by boo', () => {
    const example = getExamplePushs()
    example[0].type = 'BOO'

    const filtered = pushUserFilter(
      example,
      settting({ boo: '' }),
    );

    expect(filtered).toEqual([
      "eva05s", "fiendeo",
    ])
  })

  it('filter by arrow', () => {
    const filtered = pushUserFilter(
      getExamplePushs(),
      settting({ arrow: '', sendAmount: '5' }),
    );

    expect(filtered[4]).toEqual("kuku321")
  })
})

const DEFAULT_ATTRS = {
  sendAmount: '2',
  nFloors: 1,
  push: 'on',
  boo: 'on',
  arrow: 'on',
}
function settting(attrs) {
  const form = new FormData();
  const attrsWithDefault = { ...DEFAULT_ATTRS, ...attrs };
  Object.entries(attrsWithDefault).forEach(([key, value]) => {
    form.set(key, value);
  })
  return form;
}

// Example data from: https://www.ptt.cc/bbs/PlayStation/M.1503932148.A.4D4.html
function getExamplePushs() {
  return [
    {
      type: "PUSH",
      id: "hipposman",
      comment: ": 這就是專業                                           ",
      timestamp: "08/28 22:57  ",
      raw: "<span class=\"q15 b0\">推 </span><span class=\"q11 b0\">hipposman</span><span class=\"q3 b0\">: 這就是專業                                           </span><span class=\"q7 b0\">08/28 22:57  </span>"
    },
    {
      type: "PUSH",
      id: "eva05s",
      comment: ": 沒錯，還有小正太                                        ",
      timestamp: "08/28 22:57  ",
      raw: "<span class=\"q15 b0\">推 </span><span class=\"q11 b0\">eva05s</span><span class=\"q3 b0\">: 沒錯，還有小正太                                        </span><span class=\"q7 b0\">08/28 22:57  </span>"
    },
    {
      type: "PUSH",
      id: "fiendeo",
      comment: ": 好期待！！我是明天晚上場的 &gt; &lt;                         ",
      timestamp: "08/28 23:00  ",
      raw: "<span class=\"q15 b0\">推 </span><span class=\"q11 b0\">fiendeo</span><span class=\"q3 b0\">: 好期待！！我是明天晚上場的 &gt; &lt;                         </span><span class=\"q7 b0\">08/28 23:00  </span>"
    },
    {
      type: "PUSH",
      id: "iamnotgm",
      comment: ": 就說很多人被9S和亞當夏娃拉進來阿XDDD                  ",
      timestamp: "08/28 23:01  ",
      raw: "<span class=\"q15 b0\">推 </span><span class=\"q11 b0\">iamnotgm</span><span class=\"q3 b0\">: 就說很多人被9S和亞當夏娃拉進來阿XDDD                  </span><span class=\"q7 b0\">08/28 23:01  </span>"
    },
    {
      type: "ARROW",
      id: "danielwoody",
      comment: ": 請問現場是有販賣週邊嗎？                           ",
      timestamp: "08/28 23:06  ",
      raw: "<span class=\"q9 b0\">→ </span><span class=\"q11 b0\">danielwoody</span><span class=\"q3 b0\">: 請問現場是有販賣週邊嗎？                           </span><span class=\"q7 b0\">08/28 23:06  </span>"
    },
    {
      type: "ARROW",
      id: "aaronpwyu",
      comment: ": 場地很爛是基本的 XD                                  ",
      timestamp: "08/28 23:07  ",
      raw: "<span class=\"q9 b0\">→ </span><span class=\"q11 b0\">aaronpwyu</span><span class=\"q3 b0\">: 場地很爛是基本的 XD                                  </span><span class=\"q7 b0\">08/28 23:07  </span>"
    },
    {
      type: "ARROW",
      id: "kuku321",
      comment: ": 是悠木碧堅持要去台灣才讓她出現一天的XDDD               ",
      timestamp: "08/28 23:11  ",
      raw: "<span class=\"q9 b0\">→ </span><span class=\"q11 b0\">kuku321</span><span class=\"q3 b0\">: 是悠木碧堅持要去台灣才讓她出現一天的XDDD               </span><span class=\"q7 b0\">08/28 23:11  </span>"
    },
    {
      type: "PUSH",
      id: "ice6",
      comment: ": 有，但是只有持當日場次門票者限購一次，買之前要先想好      ",
      timestamp: "08/28 23:15  ",
      raw: "<span class=\"q15 b0\">推 </span><span class=\"q11 b0\">ice6</span><span class=\"q3 b0\">: 有，但是只有持當日場次門票者限購一次，買之前要先想好      </span><span class=\"q7 b0\">08/28 23:15  </span>"
    },
    {
      type: "PUSH",
      id: "cwr5",
      comment: ": 有去，那個重低音喇叭把Emi Evans的歌聲都蓋掉了……         ",
      timestamp: "08/28 23:28  ",
      raw: "<span class=\"q15 b0\">推 </span><span class=\"q11 b0\">cwr5</span><span class=\"q3 b0\">: 有去，那個重低音喇叭把Emi Evans的歌聲都蓋掉了……         </span><span class=\"q7 b0\">08/28 23:28  </span>"
    },
    {
      type: "PUSH",
      id: "hoshino1219",
      comment: ": 螢幕字幕速度差的是蠻多的…囧                       ",
      timestamp: "08/28 23:30  ",
      raw: "<span class=\"q15 b0\">推 </span><span class=\"q11 b0\">hoshino1219</span><span class=\"q3 b0\">: 螢幕字幕速度差的是蠻多的…囧                       </span><span class=\"q7 b0\">08/28 23:30  </span>"
    },
    {
      type: "PUSH",
      id: "slainshadow",
      comment: ": 悠木也是在幾乎緊湊的行程表裡擠出時間來的...之前是  ",
      timestamp: "08/28 23:31  ",
      raw: "<span class=\"q15 b0\">推 </span><span class=\"q11 b0\">slainshadow</span><span class=\"q3 b0\">: 悠木也是在幾乎緊湊的行程表裡擠出時間來的...之前是  </span><span class=\"q7 b0\">08/28 23:31  </span>"
    },
    {
      type: "ARROW",
      id: "slainshadow",
      comment: ": 不是有人說行程滿的(?                               ",
      timestamp: "08/28 23:31  ",
      raw: "<span class=\"q9 b0\">→ </span><span class=\"q11 b0\">slainshadow</span><span class=\"q3 b0\">: 不是有人說行程滿的(?                               </span><span class=\"q7 b0\">08/28 23:31  </span>"
    },
    {
      type: "ARROW",
      id: "kuku321",
      comment: ": 4GAMERS的專訪也可以看一下 最後一段真的會笑死           ",
      timestamp: "08/28 23:45  ",
      raw: "<span class=\"q9 b0\">→ </span><span class=\"q11 b0\">kuku321</span><span class=\"q3 b0\">: 4GAMERS的專訪也可以看一下 最後一段真的會笑死           </span><span class=\"q7 b0\">08/28 23:45  </span>"
    },
    {
      type: "ARROW",
      id: "kuku321",
      comment: ": \"買了水貨可以退\" 橫尾真的是擅長講幹話的朋友XDDD        ",
      timestamp: "08/28 23:46  ",
      raw: "<span class=\"q9 b0\">→ </span><span class=\"q11 b0\">kuku321</span><span class=\"q3 b0\">: \"買了水貨可以退\" 橫尾真的是擅長講幹話的朋友XDDD        </span><span class=\"q7 b0\">08/28 23:46  </span>"
    },
    {
      type: "ARROW",
      id: "kuku321",
      comment: ": 齋藤P:(擦汗中                                          ",
      timestamp: "08/28 23:46  ",
      raw: "<span class=\"q9 b0\">→ </span><span class=\"q11 b0\">kuku321</span><span class=\"q3 b0\">: 齋藤P:(擦汗中                                          </span><span class=\"q7 b0\">08/28 23:46  </span>"
    },
    {
      type: "PUSH",
      id: "weiweiut",
      comment: ": 很不喜歡工作人員在演奏的時候走來走去... ，幾乎每首曲  ",
      timestamp: "08/28 23:52  ",
      raw: "<span class=\"q15 b0\">推 </span><span class=\"q11 b0\">weiweiut</span><span class=\"q3 b0\">: 很不喜歡工作人員在演奏的時候走來走去... ，幾乎每首曲  </span><span class=\"q7 b0\">08/28 23:52  </span>"
    },
    {
      type: "ARROW",
      id: "weiweiut",
      comment: ": 子都有工作人員走動                                    ",
      timestamp: "08/28 23:52  ",
      raw: "<span class=\"q9 b0\">→ </span><span class=\"q11 b0\">weiweiut</span><span class=\"q3 b0\">: 子都有工作人員走動                                    </span><span class=\"q7 b0\">08/28 23:52  </span>"
    },
    {
      type: "PUSH",
      id: "Kamikiri",
      comment: ": 尼爾的歌都是造語  蠻好奇歌詞表是怎麼標發音的          ",
      timestamp: "08/29 00:13  ",
      raw: "<span class=\"q15 b0\">推 </span><span class=\"q11 b0\">Kamikiri</span><span class=\"q3 b0\">: 尼爾的歌都是造語  蠻好奇歌詞表是怎麼標發音的          </span><span class=\"q7 b0\">08/29 00:13  </span>"
    },
    {
      type: "PUSH",
      id: "takam",
      comment: ": 這場地非常不適合這種類型的音樂會啊XD                     ",
      timestamp: "08/29 00:17  ",
      raw: "<span class=\"q15 b0\">推 </span><span class=\"q11 b0\">takam</span><span class=\"q3 b0\">: 這場地非常不適合這種類型的音樂會啊XD                     </span><span class=\"q7 b0\">08/29 00:17  </span>"
    },
    {
      type: "PUSH",
      id: "vans24",
      comment: ": 看了k大的訪談，沒想到連音樂會都和中文化中心有關，中文  ",
      timestamp: " 08/29 00:25  ",
      raw: "<span class=\"q15 b0\">推 </span><span class=\"q11 b0\">vans24</span><span class=\"q3 b0\">: 看了k大的訪談，沒想到連音樂會都和中文化中心有關，中文  </span><span class=\"q7 b0\"> 08/29 00:25  </span>"
    },
    {
      type: "ARROW",
      id: "vans24",
      comment: ": 化中心真的是台灣玩家的福氣                              ",
      timestamp: "08/29 00:26  ",
      raw: "<span class=\"q9 b0\">→ </span><span class=\"q11 b0\">vans24</span><span class=\"q3 b0\">: 化中心真的是台灣玩家的福氣                              </span><span class=\"q7 b0\">08/29 00:26  </span>"
    },
    {
      type: "PUSH",
      id: "ha02",
      comment: ": 螢幕字幕好多地方都很慢才切換                              ",
      timestamp: "08/29 00:47  ",
      raw: "<span class=\"q15 b0\">推 </span><span class=\"q11 b0\">ha02</span><span class=\"q3 b0\">: 螢幕字幕好多地方都很慢才切換                              </span><span class=\"q7 b0\">08/29 00:47  </span>"
    },
    {
      type: "PUSH",
      id: "sniperex168",
      comment: ": 推心得，推尼爾，也推訪談                           ",
      timestamp: "08/29 01:19  ",
      raw: "<span class=\"q15 b0\">推 </span><span class=\"q11 b0\">sniperex168</span><span class=\"q3 b0\">: 推心得，推尼爾，也推訪談                           </span><span class=\"q7 b0\">08/29 01:19  </span>"
    },
    {
      type: "PUSH",
      id: "david51005",
      comment: ": 我倒覺得字幕慢一點比較好 不然用聽的人都被雷         ",
      timestamp: "08/29 01:37  ",
      raw: "<span class=\"q15 b0\">推 </span><span class=\"q11 b0\">david51005</span><span class=\"q3 b0\">: 我倒覺得字幕慢一點比較好 不然用聽的人都被雷         </span><span class=\"q7 b0\">08/29 01:37  </span>"
    },
    {
      type: "PUSH",
      id: "ansmms",
      comment: ": 不是說現場開放預購中文版BD? 還是哪裡可以預購阿          ",
      timestamp: "08/29 01:46  ",
      raw: "<span class=\"q15 b0\">推 </span><span class=\"q11 b0\">ansmms</span><span class=\"q3 b0\">: 不是說現場開放預購中文版BD? 還是哪裡可以預購阿          </span><span class=\"q7 b0\">08/29 01:46  </span>"
    },
    {
      type: "PUSH",
      id: "kay675kay675",
      comment: ": 賣週邊的櫃檯可以預購                              ",
      timestamp: "08/29 02:24  ",
      raw: "<span class=\"q15 b0\">推 </span><span class=\"q11 b0\">kay675kay675</span><span class=\"q3 b0\">: 賣週邊的櫃檯可以預購                              </span><span class=\"q7 b0\">08/29 02:24  </span>"
    },
    {
      type: "PUSH",
      id: "ionchips",
      comment: ": 有一兩首音響蓋過提琴聲QQ  人聲倒是因為歌手都很有實力  ",
      timestamp: "08/29 02:37  ",
      raw: "<span class=\"q15 b0\">推 </span><span class=\"q11 b0\">ionchips</span><span class=\"q3 b0\">: 有一兩首音響蓋過提琴聲QQ  人聲倒是因為歌手都很有實力  </span><span class=\"q7 b0\">08/29 02:37  </span>"
    },
    {
      type: "ARROW",
      id: "ionchips",
      comment: ": 所以聽得還算清楚                                      ",
      timestamp: "08/29 02:37  ",
      raw: "<span class=\"q9 b0\">→ </span><span class=\"q11 b0\">ionchips</span><span class=\"q3 b0\">: 所以聽得還算清楚                                      </span><span class=\"q7 b0\">08/29 02:37  </span>"
    },
    {
      type: "PUSH",
      id: "ionchips",
      comment: ": 字幕我也覺得慢了   日文都講完新的一句了才換頁   因    ",
      timestamp: "08/29 02:39  ",
      raw: "<span class=\"q15 b0\">推 </span><span class=\"q11 b0\">ionchips</span><span class=\"q3 b0\">: 字幕我也覺得慢了   日文都講完新的一句了才換頁   因    </span><span class=\"q7 b0\">08/29 02:39  </span>"
    },
    {
      type: "ARROW",
      id: "ionchips",
      comment: ": 為不諳日文但大概知道斷點在哪所以有點辛苦= =           ",
      timestamp: "08/29 02:39  ",
      raw: "<span class=\"q9 b0\">→ </span><span class=\"q11 b0\">ionchips</span><span class=\"q3 b0\">: 為不諳日文但大概知道斷點在哪所以有點辛苦= =           </span><span class=\"q7 b0\">08/29 02:39  </span>"
    },
    {
      type: "PUSH",
      id: "argoth",
      comment: ": 竟然有悠木！                                            ",
      timestamp: "08/29 03:16  ",
      raw: "<span class=\"q15 b0\">推 </span><span class=\"q11 b0\">argoth</span><span class=\"q3 b0\">: 竟然有悠木！                                            </span><span class=\"q7 b0\">08/29 03:16  </span>"
    },
    {
      type: "ARROW",
      id: "danielwoody",
      comment: ": 有沒有人能夠幫忙買個原聲帶QAQ                      ",
      timestamp: "08/29 07:58  ",
      raw: "<span class=\"q9 b0\">→ </span><span class=\"q11 b0\">danielwoody</span><span class=\"q3 b0\">: 有沒有人能夠幫忙買個原聲帶QAQ                      </span><span class=\"q7 b0\">08/29 07:58  </span>"
    },
    {
      type: "PUSH",
      id: "lwecloud",
      comment: ": 有放音樂的歌都很慘 例:美シキ歌                        ",
      timestamp: "08/29 08:56  ",
      raw: "<span class=\"q15 b0\">推 </span><span class=\"q11 b0\">lwecloud</span><span class=\"q3 b0\">: 有放音樂的歌都很慘 例:美シキ歌                        </span><span class=\"q7 b0\">08/29 08:56  </span>"
    },
    {
      type: "ARROW",
      id: "lwecloud",
      comment: ": 音控失敗                                              ",
      timestamp: "08/29 08:56  ",
      raw: "<span class=\"q9 b0\">→ </span><span class=\"q11 b0\">lwecloud</span><span class=\"q3 b0\">: 音控失敗                                              </span><span class=\"q7 b0\">08/29 08:56  </span>"
    },
    {
      type: "ARROW",
      id: "lwecloud",
      comment: ": 工作人員在旁邊一直拍照也很干擾 快門聲喀擦喀擦         ",
      timestamp: "08/29 08:57  ",
      raw: "<span class=\"q9 b0\">→ </span><span class=\"q11 b0\">lwecloud</span><span class=\"q3 b0\">: 工作人員在旁邊一直拍照也很干擾 快門聲喀擦喀擦         </span><span class=\"q7 b0\">08/29 08:57  </span>"
    },
    {
      type: "PUSH",
      id: "alan0204",
      comment: ": 推                                                    ",
      timestamp: "08/29 09:00  ",
      raw: "<span class=\"q15 b0\">推 </span><span class=\"q11 b0\">alan0204</span><span class=\"q3 b0\">: 推                                                    </span><span class=\"q7 b0\">08/29 09:00  </span>"
    },
    {
      type: "ARROW",
      id: "ionchips",
      comment: ": 另外悠木真的很可愛! 一開始不知她是狂粉  不過從現場感  ",
      timestamp: "08/29 09:07  ",
      raw: "<span class=\"q9 b0\">→ </span><span class=\"q11 b0\">ionchips</span><span class=\"q3 b0\">: 另外悠木真的很可愛! 一開始不知她是狂粉  不過從現場感  </span><span class=\"q7 b0\">08/29 09:07  </span>"
    },
    {
      type: "ARROW",
      id: "ionchips",
      comment: ": 受到她對這遊戲的熱情XDD                               ",
      timestamp: "08/29 09:08  ",
      raw: "<span class=\"q9 b0\">→ </span><span class=\"q11 b0\">ionchips</span><span class=\"q3 b0\">: 受到她對這遊戲的熱情XDD                               </span><span class=\"q7 b0\">08/29 09:08  </span>"
    },
    {
      type: "PUSH",
      id: "lwecloud",
      comment: ": 她今天還沒喝酒 喝了更...                              ",
      timestamp: "08/29 09:09  ",
      raw: "<span class=\"q15 b0\">推 </span><span class=\"q11 b0\">lwecloud</span><span class=\"q3 b0\">: 她今天還沒喝酒 喝了更...                              </span><span class=\"q7 b0\">08/29 09:09  </span>"
    },
    {
      type: "PUSH",
      id: "Snowman",
      comment: ": 喝了會變佳子嗎                                         ",
      timestamp: "08/29 10:04  ",
      raw: "<span class=\"q15 b0\">推 </span><span class=\"q11 b0\">Snowman</span><span class=\"q3 b0\">: 喝了會變佳子嗎                                         </span><span class=\"q7 b0\">08/29 10:04  </span>"
    },
    {
      type: "PUSH",
      id: "darkdeus",
      comment: ": 喝酒XDDDD                                             ",
      timestamp: "08/29 11:04  ",
      raw: "<span class=\"q15 b0\">推 </span><span class=\"q11 b0\">darkdeus</span><span class=\"q3 b0\">: 喝酒XDDDD                                             </span><span class=\"q7 b0\">08/29 11:04  </span>"
    },
    {
      type: "PUSH",
      id: "cooleagles",
      comment: ": 好想看帕斯卡叔叔啊，可惜今天沒有了…               ",
      timestamp: " 08/29 11:05  ",
      raw: "<span class=\"q15 b0\">推 </span><span class=\"q11 b0\">cooleagles</span><span class=\"q3 b0\">: 好想看帕斯卡叔叔啊，可惜今天沒有了…               </span><span class=\"q7 b0\"> 08/29 11:05  </span>"
    },
    {
      type: "PUSH",
      id: "cow60106",
      comment: ": 聽說現場有聲優箱子可以放卡片是嗎                      ",
      timestamp: "08/29 11:49  ",
      raw: "<span class=\"q15 b0\">推 </span><span class=\"q11 b0\">cow60106</span><span class=\"q3 b0\">: 聽說現場有聲優箱子可以放卡片是嗎                      </span><span class=\"q7 b0\">08/29 11:49  </span>"
    },
    {
      type: "ARROW",
      id: "aaronpwyu",
      comment: ": Game類音樂會以前經驗是都有box                       ",
      timestamp: " 08/29 12:02  ",
      raw: "<span class=\"q9 b0\">→ </span><span class=\"q11 b0\">aaronpwyu</span><span class=\"q3 b0\">: Game類音樂會以前經驗是都有box                       </span><span class=\"q7 b0\"> 08/29 12:02  </span>"
    },
    {
      type: "ARROW",
      id: "ionchips",
      comment: ": 箱子應該在內場的門口附近  因為不知道有這活動所以看到  ",
      timestamp: "08/29 12:06  ",
      raw: "<span class=\"q9 b0\">→ </span><span class=\"q11 b0\">ionchips</span><span class=\"q3 b0\">: 箱子應該在內場的門口附近  因為不知道有這活動所以看到  </span><span class=\"q7 b0\">08/29 12:06  </span>"
    },
    {
      type: "ARROW",
      id: "ionchips",
      comment: ": 還想說那是啥東西                                      ",
      timestamp: "08/29 12:06  ",
      raw: "<span class=\"q9 b0\">→ </span><span class=\"q11 b0\">ionchips</span><span class=\"q3 b0\">: 還想說那是啥東西                                      </span><span class=\"q7 b0\">08/29 12:06  </span>"
    }
  ]
}
