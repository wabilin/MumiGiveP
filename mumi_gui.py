#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Tkinter import *


class MumiGui:
    def __init__(self, root):
        self.root = root
        root.minsize(width=600, height=400)
        self._setup_ui()

    def _setup_ui(self):
        root = self.root

        e1 = Entry(root, width=40)
        e2 = Entry(root)
        e3 = Entry(root, show='*')

        e1.grid(row=0, column=1, columnspan=3, sticky=W)
        e2.grid(row=1, column=1, sticky=W)
        e3.grid(row=1, column=3, sticky=W)

        l1 = Label(root, text=u"PTT 文章網址:")
        l1.grid(row=0, column=0, sticky=E)
        l1.bind('<Button-1>', lambda e: e1.focus_set())

        l2 = Label(root, text=u"您的 PTT 帳號:")
        l2.grid(row=1, column=0, sticky=E)
        l2.bind('<Button-1>', lambda e: e2.focus_set())

        l3 = Label(root, text=u"密碼:")
        l3.grid(row=1, column=2, sticky=E)
        l3.bind('<Button-1>', lambda e: e3.focus_set())

        amount_label = Label(root, text=u"發送數量:")
        amount_label.grid(row=2, column=0, sticky=E)
        amount_en = Entry(root, width=5)
        amount_en.grid(row=2, column=1, sticky=W)

        money_label = Label(root, text=u"每筆稅前金額:")
        money_label.grid(row=2, column=2, sticky=E)
        money_en = Entry(root, width=5)
        money_en.grid(row=2, column=3, sticky=W)

        l4 = Label(root, text=u"樓發一次")
        l4.grid(row=3, column=1, sticky=W)
        e4 = Entry(root, width=2)
        e4.grid(row=3, column=0, sticky=E)

        Label(root, text=u"姆咪選項").grid(row=4)

        self.var = BooleanVar(value=True)
        c = Checkbutton(root, text=u"不重複發送給同ㄧID", variable=self.var,
                        onvalue=True, offvalue=False)
        c.grid(row=5, column=0)

        self._create_give_push_options(6)

        self.console = Text(root, width=80, height=10, bg='black', fg='white')
        self.console.configure(state='disabled')
        self.console.grid(row=8, columnspan=4)

        self.go_button = Button(root, text="GO", command=lambda x: x)
        self.go_button.grid(row=7)

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
        pass

    def run(self):
        self.root.mainloop()


def main():
    root = Tk()
    root.title(u'姆咪姆咪發錢錢')
    app = MumiGui(root)
    app.run()


if __name__ == '__main__':
    main()
