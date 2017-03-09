#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Tkinter import *
import threading
import Queue
from ptt_agent import PttIo
from push_list_gen import push_list_from_url, push_list_from_clipboard
from push_filter import filter_push_list
from mumi_view import MumiUi, show_error, confirm_list_dialog

SUCCEED_MSG = "***Succeed***"


class Mumi:
    def __init__(self, ui):
        self._pttThread = None
        self._ui = ui
        self._lst = []
        self._data = None

    def start(self):
        self._ui.buttons['GO'].config(command=self._go_action)
        self._ui.start()

    def _deal_with_failed(self, msg):
        retry = self._ui.ask_retry()
        if retry:
            self._lst = msg['sent']
            self._ask_for_give_p()
        else:
            self._ui.quit()

    def _listen_ptt_thread(self, msg_queue):
        while not msg_queue.empty():
            msg = msg_queue.get()
            if type(msg) is str:
                if msg == SUCCEED_MSG:
                    self._ui.done()
                    return
                else:
                    self._ui.show(msg)

            elif type(msg) is dict:
                self._deal_with_failed(msg)
                return

        self._ui.after(100, self._listen_ptt_thread, msg_queue)

    def _start_give_p(self, user, money):
        if not money:
            return

        msg_queue = Queue.Queue()
        ptt_thread = PttThread(user, money, self._lst,
                               msg_queue=msg_queue)
        ptt_thread.start()
        self._listen_ptt_thread(msg_queue)

    def _go_action(self):
        data = self._ui.get_data()

        opt = data['options']
        if not (opt['step'] and opt['amount']):
            return

        push_list = (push_list_from_clipboard() if self._ui.from_clipboard
                     else push_list_from_url(data['url']))
        self._lst = filter_push_list(push_list, opt)

        self.user = data['user']
        self.money = data['money']

        self._ask_for_give_p()

    def _ask_for_give_p(self):
        u, m = self.user, self.money
        confirm_list_dialog(self._lst,
                            lambda: self._start_give_p(u, m))


class PttThread(threading.Thread):
    def __init__(self, user, money, lst, msg_queue):
        super(PttThread, self).__init__()
        self.msg_queue = msg_queue
        self.user = user
        self.lst = lst
        self.money = money
        self._sent_count = 0
        self._stop = threading.Event()

    def _send_msg(self, msg):
        self.msg_queue.put(msg)

    def _failed(self):
        self._send_msg({'type': 'failed',
                        'sent': self.lst[self._sent_count:]})

    def run(self):
        user, lst, money = self.user, self.lst, self.money

        callbacks = {
            'printer': (lambda x: self._send_msg(x)),
            'failed': (lambda: self._failed())
        }
        ptt = PttIo(user, 10, callbacks)

        if not ptt.login():
            show_error(u"連線失敗", u"無法與 PTT 建立連線。")
            return
        self._send_msg('Login in to PTT...')

        if not ptt.go_store():
            show_error(u"登入失敗", u"無法登入PTT，請檢查帳號密碼有無錯誤。")
            return

        self._send_msg('Entering PTT store...')

        for m in lst:
            if ptt.give_money(m, str(money)):
                self._send_msg("Give {} money to {}. Done!".format(money, m))
                self._sent_count += 1
            else:
                self._failed()
                return

        ptt.logout()
        self._send_msg(SUCCEED_MSG)


def main():
    root = Tk()
    root.title(u'姆咪姆咪發錢錢')
    ui = MumiUi(root)
    app = Mumi(ui)
    app.start()


if __name__ == '__main__':
    main()
