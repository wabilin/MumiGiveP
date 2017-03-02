#!/usr/bin/env python
# -*- coding: utf-8 -*-

from collections import OrderedDict
from ptt_coin_bot import auto_give_money
from ptt_html import push_list_from_url

def main():
    print "請輸入 PTT 文章網址 :"
    url = raw_input()
    count_limit = int(raw_input("要發幾樓 ?"))
    money = int(raw_input("每個人多少錢 ?"))

    lst = push_list_from_url(url)
    lst = [x['id'] for x in lst]
    lst = list(OrderedDict.fromkeys(lst))
    lst = lst[:count_limit]

    print "預計發錢給以下 ID :"

    for i, name in enumerate(lst):
        print str(i+1) + ' : ' + name

    yes = raw_input("確認無誤 ? [y/N] : ")
    if yes == 'y' or yes == 'Y':
        auto_give_money(money, lst)


if __name__ == '__main__':
    main()
