#!/usr/bin/env python
# -*- coding: utf-8 -*-

from collections import OrderedDict
from ptt_coin_bot import auto_give_money
from ptt_html import push_list_from_url


def ask_allowed_types():
    allowed_types = []

    r = raw_input("Give money to 'PUSH(1)'s? [Y/n]: ")
    if r != 'n' and r != 'N':
        allowed_types.append(1)

    r = raw_input("Give money to 'BOO (2)'s? [Y/n]: ")
    if r != 'n' and r != 'N':
        allowed_types.append(2)

    r = raw_input("Give money to '--> (3)'s? [Y/n]: ")
    if r != 'n' and r != 'N':
        allowed_types.append(3)

    return allowed_types


def ask_for_setting(amount):
    # default values
    opt = {
        'allowed_types': [1, 2, 3],
        'floor_limit': None,
        'step': 1,
        'duplicate': False,
        'amount': amount
    }

    r = raw_input("Would you like to set advanced settings? [y/N]: ")
    if r != 'y' and r != 'Y':
        return opt

    opt['allowed_types'] = ask_allowed_types()

    r = raw_input("Set Maximum Floor[y/N]: ")
    if r == 'y' or r == 'Y':
        opt['floor_limit'] = int(raw_input("Maximum Floor: "))

    r = raw_input("Allow duplicate IDs? [y/N]: ")
    if r == 'y' or r == 'Y':
        opt['duplicate'] = True

    r = raw_input("Only give to N, 2N, 3N...kN floors[y/N]: ")
    if r == 'y' or r == 'Y':
        opt['step'] = int(raw_input("N = ? : "))

    return opt


def filter_push_list(push_list, option):
    allowed_types = option['allowed_types']
    floor_limit = option['floor_limit']
    step = option['step']
    duplicate = option['duplicate']
    amount = option['amount']

    if floor_limit:
        push_list = push_list[:floor_limit]

    # step
    push_list = [v for i, v in enumerate(push_list) if (i+1) % step == 0]

    # push type
    push_list = [x for x in push_list if (x['push'] in allowed_types)]

    id_list = [x['id'] for x in push_list]

    if not duplicate:
        id_list = list(OrderedDict.fromkeys(id_list))

    if amount:
        id_list = id_list[:amount]

    return id_list


def main():
    print "Please enter the url to the PTT post:"
    url = raw_input()
    amount = int(raw_input("How many person (at most): "))
    money = int(raw_input("How much money for each one: "))

    push_list = push_list_from_url(url)
    opt = ask_for_setting(amount)

    lst = filter_push_list(push_list, opt)

    print "It's going to give money to these IDs:"

    for i, name in enumerate(lst):
        print str(i+1) + ' : ' + name

    yes = raw_input("Aru you sure [y/N]: ")
    if yes == 'y' or yes == 'Y':
        auto_give_money(money, lst)


if __name__ == '__main__':
    main()
