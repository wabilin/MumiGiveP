#!/usr/bin/env python
# -*- coding: utf-8 -*-

import StringIO
import telnetlib
from time import sleep
from lib import uao_decode

HOST = "ptt.cc"


def ptt_to_utf8(ptt_msg):
    return ptt_msg.decode('uao_decode').encode('utf8')


class PttAction:
    def __init__(self, expected, keyin, opt_acts=None, newline=True):
        pass


class PttIo:
    def __init__(self, user, time_limit, callbacks):
        self.tn = telnetlib.Telnet(HOST)
        self.account = user['id']
        self.password = user['password']
        self.time_limit = time_limit
        self.buffer = ''
        self._log = StringIO.StringIO()
        self.printer = callbacks['printer']
        self.failed = callbacks['failed']

    def clear_buffer(self):
        self.buffer = ''

    def expect_action(self, expected, res, opt_acts=None, newline=True):
        msg, buf, telnet = '', self.buffer, self.tn

        waiting_time = 0.2
        loop_times = self.time_limit * 5  # waiting time is 0.2 second
        for _ in xrange(loop_times):
            sleep(waiting_time)
            buf += telnet.read_very_eager()
            msg = ptt_to_utf8(buf)

            if expected in msg:
                self.log(msg)
                enter_msg(self.tn, res, newline)

                self.clear_buffer()
                return

            elif opt_acts:
                matched = [x for x in opt_acts if x[0] in msg]
                if matched:
                    self.log(msg)
                    enter_msg(self.tn, matched[0][1], newline)
                    buf = ''

        self.log(msg)
        self.timeout_fail()

    def login(self):
        self.expect_action("註冊", self.account)
        self.expect_action("請輸入您的密碼", self.password)

    def go_store(self):
        self.expect_action("主功能表", 'p',
                           opt_acts=[["請按任意鍵繼續", ''],
                                     ["刪除其他", 'y'],
                                     ["錯誤嘗試的記錄", 'n']])

        self.expect_action("網路遊樂場", 'p')

    def give_money(self, name, money):
        if name.lower() == self.account.lower():
            self.printer("Can not give money to yourself.")
            return

        # Assert in ptt store page
        self.expect_action("給其他人Ptt幣", '0')
        self.expect_action("這位幸運兒的id", name)
        self.expect_action("請輸入金額", money)
        self.expect_action("要修改紅包袋嗎", 'n',
                           opt_acts=[["請輸入您的密碼", self.password],
                                     ["確定進行交易嗎", 'y']])

        self.expect_action("按任意鍵繼續", '')

    def log(self, msg):
        print >>self._log, msg

    def logout(self):
        self.tn.write(b'\x1b[D')

        self.expect_action("按任意鍵繼續", '',
                           opt_acts=[["網路遊樂場", b'\x1b[D'],
                                     ["主功能表", "G\r\n"],
                                     ["您確定要離開", "y\r\n"]],
                           newline=False)

    def timeout_fail(self):
        print "Can not get response in time."
        log_file = open('log.txt', 'w')
        log_file.write(self._log.getvalue())
        self._log.close()
        log_file.close()
        self.failed()


def enter_msg(tn, msg, newline):
    if newline:
        tn.write(msg + "\r\n")
    else:
        tn.write(msg)
