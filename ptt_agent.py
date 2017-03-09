#!/usr/bin/env python
# -*- coding: utf-8 -*-

import StringIO
import telnetlib
from time import sleep
from lib import uao_decode

HOST = "ptt.cc"


def ptt_to_utf8(ptt_msg):
    return ptt_msg.decode('uao_decode').encode('utf8')


class PttAct:
    def __init__(self, expected, key_in, opt_acts=None, newline=True):
        self.expected = expected
        self.key_in = key_in
        self.opt_acts = opt_acts
        self.newline = newline


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

    def _clear_buffer(self):
        self.buffer = ''

    def _expect_action(self, expected, res, opt_acts=None, newline=True):
        msg, buf, telnet = '', self.buffer, self.tn

        waiting_time = 0.2
        loop_times = self.time_limit * 5  # waiting time is 0.2 second
        for _ in xrange(loop_times):
            sleep(waiting_time)

            try:
                buf += telnet.read_very_eager()
            except EOFError:
                # connection end by host
                return False

            msg = ptt_to_utf8(buf)

            if expected in msg:
                self._write_log(msg)
                enter_msg(self.tn, res, newline)

                self._clear_buffer()
                return True

            elif opt_acts:
                matched = [x for x in opt_acts if x[0] in msg]
                if matched:
                    self._write_log(msg)
                    enter_msg(self.tn, matched[0][1], newline)
                    buf = ''

        self._write_log(msg)
        return False

    def _expect_actions(self, actions):
        for act in actions:
            r = self._expect_action(act.expected, act.key_in,
                                    act.opt_acts, act.newline)
            if not r:
                return False
        return True

    def _write_log(self, msg):
        print >>self._log, msg

    def login(self):
        actions = [PttAct("註冊", self.account),
                   PttAct("請輸入您的密碼", self.password)]
        return self._expect_actions(actions)

    def go_store(self):
        actions = [PttAct("主功能表", 'p',
                          opt_acts=[["請按任意鍵繼續", ''],
                                    ["刪除其他", 'y'],
                                    ["錯誤嘗試的記錄", 'n']]),
                   PttAct("網路遊樂場", 'p')]
        return self._expect_actions(actions)

    def give_money(self, name, money):
        if name.lower() == self.account.lower():
            self.printer("Can not give money to yourself.")
            return True

        # Assert start from ptt store page
        actions = [PttAct("給其他人Ptt幣", '0'),
                   PttAct("這位幸運兒的id", name),
                   PttAct("請輸入金額", money),
                   PttAct("要修改紅包袋嗎", 'n',
                          opt_acts=[["請輸入您的密碼", self.password],
                                    ["確定進行交易嗎", 'y']]),
                   PttAct("按任意鍵繼續", '')]
        return self._expect_actions(actions)

    def logout(self):
        self.tn.write(b'\x1b[D')
        self._expect_action("按任意鍵繼續", '',
                            opt_acts=[["網路遊樂場", b'\x1b[D'],
                                     ["主功能表", "G\r\n"],
                                     ["您確定要離開", "y\r\n"]],
                            newline=False)
        return True

    @property
    def log(self):
        return self._log


def enter_msg(tn, msg, newline):
    if newline:
        tn.write(msg + "\r\n")
    else:
        tn.write(msg)
