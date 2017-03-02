#!/usr/bin/env python
# -*- coding: utf-8 -*-

import getpass
import sys
import telnetlib
import uao_decode
from time import sleep


HOST = "ptt.cc"


def get_account():
    uid = raw_input("Enter ur ptt id: ")
    pw = getpass.getpass()

    return {'id': uid, 'password': pw}


def ptt_to_utf8(ptt_msg):
    return ptt_msg.decode('uao_decode').encode('utf8')


class PttCoinBot:
    def __init__(self, tn, user):
        self.tn = tn
        self.account = user['id']
        self.password = user['password']


def expect_msg(telnet, expected, time_limit):
    buf, msg = '', ''
    step = 1

    for _ in xrange(0, time_limit, step):
        sleep(step)
        buf += telnet.read_very_eager()
        msg = ptt_to_utf8(buf)
        if expected in msg:
            print msg
            return True

    print msg
    return False


def expect_msgs(telnet, expected, time_limit):
    buf, msg = '', ''
    step = 1

    for _ in xrange(0, time_limit, step):
        sleep(step)
        buf += telnet.read_very_eager()
        msg = ptt_to_utf8(buf)
        for i, v in enumerate(expected):
            if v in msg:
                print msg
                return i + 1

    print msg
    return False


def enter_msg(tn, msg):
    tn.write(msg + "\r\n")


def check_then_enter(result, tn, msg):
    if not result:
        timeout_exit()
    enter_msg(tn, msg)


def timeout_exit():
    print "Can not get response in time."
    exit()


def optional_step():
    pass




def main():
    user = get_account()
    time_limit = 5

    tn = telnetlib.Telnet(HOST)

    # Enter ID
    s = expect_msg(tn, "註冊", time_limit)
    check_then_enter(s, tn, user['id'])

    # Enter password
    s = expect_msg(tn, "請輸入您的密碼", time_limit)
    check_then_enter(s, tn, user['password'])

    s = expect_msgs(tn, ["請按任意鍵繼續", "刪除其他"], time_limit)
    if s == 1:
        enter_msg(tn, "")
    elif s == 2:
        enter_msg(tn, "y")
    else:
        timeout_exit()

    # main page to ptt store
    s = expect_msg(tn, "lay", time_limit)
    check_then_enter(s, tn, 'p')

    s = expect_msg(tn, "tt量販店", time_limit)
    check_then_enter(s, tn, 'p')

    while True:
        sleep(1)
        buf = tn.read_very_eager()
        msg = ptt_to_utf8(buf)
        print msg


if __name__ == '__main__':
    main()
