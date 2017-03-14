#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Tkinter import *
import threading
import Queue
import traceback
from ptt_agent import PttIo
from push_list_gen import push_list_from_url, push_list_from_clipboard
from push_filter import filter_push_list
from mumi_view import MumiUi, show_error, confirm_list_dialog


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
            self._lst = msg['data']
            self._ask_for_give_p()
        else:
            self._ui.quit()

    def _listen_ptt_thread(self, msg_queue):
        while not msg_queue.empty():
            msg = msg_queue.get()
            msg_type, msg_data = msg['type'], msg['data']

            if msg_type == 'succeed':
                self._ui.done()
                return
            elif msg_type == 'normal':
                self._ui.show(msg_data)
            elif msg_type == 'error':
                show_error(msg_data[0], msg_data[1])
                return
            else:  # Failed
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

    def _send_msg_obj(self, msg):
        self.msg_queue.put(msg)

    def _send_normal_msg(self, msg):
        self._send_msg_obj({'type': 'normal',
                            'data': msg})

    def _send_error_msg(self, msg):
        self._send_msg_obj({'type': 'error',
                            'data': msg})

    def _send_succeed_msg(self):
        self._send_msg_obj({'type': 'succeed',
                            'data': None})

    def _failed(self):
        self._send_msg_obj({'type': 'failed',
                            'data': self.lst[self._sent_count:]})

    def _give_money(self):
        user, lst, money = self.user, self.lst, self.money

        callbacks = {
            'printer': (lambda x: self._send_normal_msg(x)),
            'failed': (lambda: self._failed())
        }
        ptt = PttIo(user, 10, callbacks)

        if not ptt.login():
            self._send_error_msg([u"連線失敗", u"無法與 PTT 建立連線。"])
            return
        self._send_normal_msg('Login in to PTT...')

        if not ptt.go_store():
            self._send_error_msg([u"登入失敗", u"無法登入PTT，請檢查帳號密碼有無錯誤。"])
            return

        self._send_normal_msg('Entering PTT store...')

        for name in lst:
            if ptt.give_money(name, str(money)):
                msg = "Give {} money to {}. Done!".format(money, name)
                self._send_normal_msg(msg)
                self._sent_count += 1
            else:
                self._failed()
                return

        ptt.logout()
        self._send_succeed_msg()

    def run(self):
        try:
            self._give_money()
        except:
            f = open('log.txt', 'w')
            traceback.print_exc(limit=20, file=f)
            f.close()
            self._send_error_msg([u"未預期錯誤發生", u"請於 log.txt 查看詳細錯誤紀錄"])


def main():
    ui = MumiUi()
    app = Mumi(ui)
    app.start()


if __name__ == '__main__':
    main()
