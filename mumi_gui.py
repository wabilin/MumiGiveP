#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Tkinter import *


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

        self.var = BooleanVar(value=True)
        c = Checkbutton(root, text=u"不重複發送給同ㄧID", variable=self.var,
                        onvalue=True, offvalue=False)
        c.grid(row=5, column=0)

        self._create_give_push_options(6)

        self.console = Text(root, width=80, height=10, bg='black', fg='white')
        self.console.configure(state='disabled')
        self.console.grid(row=8, columnspan=4)

        self.go_button = Button(root, text=u"發射姆咪", command=lambda x: x)
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

        id_entry = Entry(root)
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
        floor_en = Entry(root, width=2)
        floor_en.insert(END, '1')
        floor_en.grid(row=row+1, column=0, sticky=E)

        self.entries['amount'] = amount_en
        self.entries['money'] = money_en
        self.entries['floor'] = floor_en

    def _create_duplicate_option(self, row):
        self.entries['duplicate'] = BooleanVar(value=True)
        c = Checkbutton(self.root, text=u"不重複發送給同ㄧID",
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

    def show(self, msg):
        self.console.insert('end', msg + "\n")

    def run(self):
        self.root.mainloop()


def main():
    root = Tk()
    root.title(u'姆咪姆咪發錢錢')
    app = MumiGui(root)
    app.run()


if __name__ == '__main__':
    main()
