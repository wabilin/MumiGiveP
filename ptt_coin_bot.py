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


class PttIo:
    def __init__(self, tn, user, time_limit):
        self.tn = tn
        self.account = user['id']
        self.password = user['password']
        self.time_limit = time_limit
        self.buffer = ''

    def clear_buffer(self):
        self.buffer = ''

    def expect_action(self, expected, res, opt_acts=None):
        msg, buf, telnet = '', self.buffer, self.tn

        waiting_time = 0.2
        loop_times = self.time_limit * 5  # waiting time is 0.2 second
        for _ in xrange(loop_times):
            sleep(waiting_time)
            buf += telnet.read_very_eager()
            msg = ptt_to_utf8(buf)

            if expected in msg:
                print msg
                enter_msg(self.tn, res)

                self.clear_buffer()
                return

            elif opt_acts:
                matched = [x for x in opt_acts if x[0] in msg]
                if matched:
                    print msg
                    enter_msg(self.tn, matched[0][1])
                    buf = ''

        print msg
        timeout_exit()

    def login(self):
        self.expect_action("註冊", self.account)
        self.expect_action("請輸入您的密碼", self.password)

    def give_money(self, name, money):
        # Assert in ptt store page
        self.expect_action("給其他人Ptt幣", '0')
        self.expect_action("這位幸運兒的id", name)
        self.expect_action("請輸入金額", money)
        self.expect_action("要修改紅包袋嗎", 'n',
                           opt_acts=[["請輸入您的密碼", self.password],
                                     ["確定進行交易嗎", 'y']])

        self.expect_action("按任意鍵繼續", '')


def enter_msg(tn, msg):
    tn.write(msg + "\r\n")


def timeout_exit():
    print "Can not get response in time."
    exit()


def auto_give_money(money, mumi_list):
    user = get_account()
    tn = telnetlib.Telnet(HOST)

    ptt = PttIo(tn, user, 10)

    ptt.login()

    print 'Login...'

    ptt.expect_action("主功能表", 'p',
                      opt_acts=[["請按任意鍵繼續", ''],
                                ["刪除其他", 'y'],
                                ["錯誤嘗試的記錄", "y"]])

    ptt.expect_action("網路遊樂場", 'p')

    for m in mumi_list:
        ptt.give_money(m, str(money))
        print "Give money to [" + m + "] succeed."

    # ending screen
    sleep(2)
    buf = tn.read_very_eager()
    msg = ptt_to_utf8(buf)
    print msg