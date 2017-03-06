#!/usr/bin/env python
# -*- coding: utf-8 -*-

import getpass
from ptt_agent import auto_give_money
from ptt_html import push_list_from_url
from push_filter import filter_push_list


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


def get_account():
    uid = raw_input("Enter your PTT id: ")
    pw = getpass.getpass("Enter your PTT password:")

    return {'id': uid, 'password': pw}


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
        user = get_account()
        auto_give_money(money, lst, user)


if __name__ == '__main__':
    main()
