#!/usr/bin/env python
# -*- coding: utf-8 -*-

from collections import OrderedDict


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
