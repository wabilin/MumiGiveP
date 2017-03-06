#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Tkinter import *
import tkMessageBox
from ptt_agent import auto_give_money
from ptt_html import push_list_from_url
from push_filter import filter_push_list


class MumiGui:
    def __init__(self, root):
        self.root = root
        root.minsize(width=600, height=400)
        self.entries = {}
        self._setup_ui()

    def _setup_ui(self):
        root = self.root

        self._create_url_field(row=0)
        self._create_account_field(row=1)
        self._create_money_amount_fields(2)

        Label(root, text=u"姆咪選項").grid(row=4)

        self._create_duplicate_option(5)

        self._create_give_push_options(6)

        self.go_button = Button(root, text=u"發射姆咪", command=self.go_mu_mi)
        self.go_button.grid(row=7, column=3)

    def _create_url_field(self, row):
        e = Entry(self.root, width=40)
        e.grid(row=row, column=1, columnspan=3, sticky=W)

        label = Label(self.root, text=u"PTT 文章網址:")
        label.grid(row=row, column=0, sticky=E)
        label.bind('<Button-1>', lambda x: e.focus_set())

        self.entries['url'] = e

    def _create_account_field(self, row):
        root = self.root

        id_entry = Entry(root, show='*')
        password_entry = Entry(root, show='*')

        id_entry.grid(row=row, column=1, sticky=W)
        password_entry.grid(row=row, column=3, sticky=W)

        l2 = Label(root, text=u"您的 PTT 帳號:")
        l2.grid(row=row, column=0, sticky=E)
        l2.bind('<Button-1>', lambda e: id_entry.focus_set())

        l3 = Label(root, text=u"密碼:")
        l3.grid(row=row, column=2, sticky=E)
        l3.bind('<Button-1>', lambda e: password_entry.focus_set())

        self.entries['id'] = id_entry
        self.entries['password'] = password_entry

    def _create_money_amount_fields(self, row):
        root = self.root

        Label(root, text=u"發送數量:").grid(row=row, column=0, sticky=E)
        amount_en = Entry(root, width=5)
        amount_en.grid(row=row, column=1, sticky=W)

        Label(root, text=u"每筆稅前金額:").grid(row=row, column=2, sticky=E)
        money_en = Entry(root, width=5)
        money_en.grid(row=row, column=3, sticky=W)

        Label(root, text=u"樓發一次").grid(row=row+1, column=1, sticky=W)
        step_en = Entry(root, width=2)
        step_en.insert(END, '1')
        step_en.grid(row=row+1, column=0, sticky=E)

        self.entries['amount'] = amount_en
        self.entries['money'] = money_en
        self.entries['step'] = step_en

    def _create_duplicate_option(self, row):
        self.entries['duplicate'] = BooleanVar(value=False)
        c = Checkbutton(self.root, text=u"可重複發送給同ㄧ位鄉民",
                        variable=self.entries['duplicate'],
                        onvalue=True, offvalue=False)
        c.grid(row=row, column=0)

    def _create_give_push_options(self, start_row):
        root = self.root
        Label(root, text=u"只發給: ").grid(row=start_row)
        self.give_push = {1: BooleanVar(value=True),
                          2: BooleanVar(value=True),
                          3: BooleanVar(value=True)}

        push_cht = {1: u"推", 2: u"噓", 3: u"→"}
        for i in range(1, 4):
            check = Checkbutton(root, text=push_cht[i],
                                variable=self.give_push[i],
                                onvalue=True, offvalue=False)
            check.grid(row=start_row, column=i)

    def go_mu_mi(self):
        allowed_push = [x for x in range(1, 4) if self.give_push[x].get()]
        step = to_int(self.entries['step'].get())
        duplicate = bool(self.entries['duplicate'].get())
        amount = to_int(self.entries['amount'].get())

        opt = {
            'allowed_types': allowed_push,
            'floor_limit': None,
            'step': step,
            'duplicate': duplicate,
            'amount': amount
        }

        push_list = push_list_from_url(self.entries['url'].get())

        lst = filter_push_list(push_list, opt)

        for name in lst:
            self.show(name)

        r = tkMessageBox.askquestion(u"要發錢囉", u"真的嗎?", icon='warning')
        if r == 'yes':
            user = {'id': self.entries['id'].get(),
                    'password': self.entries['password'].get()}

            self.root.after(100,
                            lambda: auto_give_money(to_int(self.entries['money'].get()),
                                                    lst, user,
                                                    printer=self.show))

    def show(self, msg):
        print msg

    def run(self):
        self.root.mainloop()


def to_int(s):
    try:
        return int(s)
    except ValueError:
        tkMessageBox.showinfo("Error",
                              "Con not convert {} to integer.".format(s))
        return None


def main():
    root = Tk()
    root.title(u'姆咪姆咪發錢錢')
    app = MumiGui(root)
    app.run()


if __name__ == '__main__':
    main()
