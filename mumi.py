#!/usr/bin/env python
# -*- coding: utf-8 -*-

from collections import OrderedDict
from ptt_coin_bot import auto_give_money
from ptt_html import push_list_from_url


def main():
    print "Please enter the url to the PTT post:"
    url = raw_input()
    count_limit = int(raw_input("How many person: "))
    money = int(raw_input("How much money for each one: "))

    lst = push_list_from_url(url)
    lst = [x['id'] for x in lst]
    lst = list(OrderedDict.fromkeys(lst))
    lst = lst[:count_limit]

    print "It's going to send money to these IDs:"

    for i, name in enumerate(lst):
        print str(i+1) + ' : ' + name

    yes = raw_input("Aru you sure [y/N]: ")
    if yes == 'y' or yes == 'Y':
        auto_give_money(money, lst)


if __name__ == '__main__':
    main()
