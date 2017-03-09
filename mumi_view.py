#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Tkinter import *
import ScrolledText
import tkMessageBox


def to_int(s):
    try:
        return int(s)
    except ValueError:
        tkMessageBox.showinfo("Error",
                              "Con not convert {} to integer.".format(s))
        return None


class MumiUi:
    def __init__(self, root):
        self.root = root
        root.minsize(width=600, height=400)
        self._entries = {}
        self.buttons = {}
        self._setup_ui()

    def _setup_ui(self):
        root = self.root

        self._create_url_field(row=0)
        self._create_account_field(row=1)
        self._create_money_amount_fields(2)

        Label(root, text=u"姆咪選項").grid(row=4)

        self._create_duplicate_option(5)
        self._create_give_push_options(6)
        self._create_go_button(7)
        self._create_console(8)

    def _create_console(self, row):
        self.console = Text(self.root,
                            width=80, height=10, bg='black', fg='white')
        self.console.configure(state='disabled')
        self.console.grid(row=row, columnspan=4)

    def _create_go_button(self, row):
        self._entries['clipboard'] = BooleanVar(value=False)
        c = Checkbutton(self.root, text=u"從剪貼簿抓取貼文 (不從網頁抓取)",
                        variable=self._entries['clipboard'],
                        onvalue=True, offvalue=False)
        c.grid(row=row, column=2)

        go_button = Button(self.root, text=u"發射姆咪")
        go_button.grid(row=row, column=3)
        self.buttons['GO'] = go_button

    def _create_url_field(self, row):
        e = Entry(self.root, width=40)
        e.grid(row=row, column=1, columnspan=3, sticky=W)

        label = Label(self.root, text=u"PTT 文章網址:")
        label.grid(row=row, column=0, sticky=E)
        label.bind('<Button-1>', lambda x: e.focus_set())

        self._entries['url'] = e

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

        self._entries['id'] = id_entry
        self._entries['password'] = password_entry

    def _create_money_amount_fields(self, row):
        root = self.root

        Label(root, text=u"發送數量:").grid(row=row, column=0, sticky=E)
        amount_en = Entry(root, width=5)
        amount_en.insert(END, '10')
        amount_en.grid(row=row, column=1, sticky=W)

        Label(root, text=u"每筆稅前金額:").grid(row=row, column=2, sticky=E)
        money_en = Entry(root, width=5)
        money_en.insert(END, '10')
        money_en.grid(row=row, column=3, sticky=W)

        Label(root, text=u"樓發一次").grid(row=row+1, column=1, sticky=W)
        step_en = Entry(root, width=2)
        step_en.insert(END, '1')
        step_en.grid(row=row+1, column=0, sticky=E)

        self._entries['amount'] = amount_en
        self._entries['money'] = money_en
        self._entries['step'] = step_en

    def _create_duplicate_option(self, row):
        self._entries['duplicate'] = BooleanVar(value=False)
        c = Checkbutton(self.root, text=u"可重複發送給同ㄧ位鄉民",
                        variable=self._entries['duplicate'],
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

    def _entry_val(self, name):
        return self._entries[name].get()

    @property
    def from_clipboard(self):
        return bool(self._entry_val('clipboard'))

    def get_data(self):
        user = {'id': self._entry_val('id'),
                'password': self._entry_val('password')}
        money = to_int(self._entry_val('money'))

        allowed_push = [x for x in range(1, 4) if self.give_push[x].get()]
        step = to_int(self._entry_val('step'))
        duplicate = bool(self._entry_val('duplicate'))
        amount = to_int(self._entry_val('amount'))

        opt = {
            'allowed_types': allowed_push,
            'floor_limit': None,
            'step': step,
            'duplicate': duplicate,
            'amount': amount
        }

        url = self._entry_val('url')

        return {
            'options': opt,
            'money': money,
            'user': user,
            'url': url
        }

    def after(self, delay, callback=None, *args):
        self.root.after(delay, callback, *args)

    def start(self):
        self.root.mainloop()

    def done(self):
        tkMessageBox.showinfo(u"姆咪大成功",
                              u"全部發完惹！感謝您使用姆咪姆咪發錢錢！")
        self.root.quit()

    def show(self, msg):
        self.console.configure(state='normal')
        self.console.insert('0.0', msg + '\n')
        self.console.configure(state='disabled')

    def ask_retry(self):
        return tkMessageBox.askretrycancel(u"姆咪嗚",
                                           u"發錢中途失敗，是否要重試? \n"
                                           u"(發送給未發送的鄉民)")

    def quit(self):
        self.root.quit()


def confirm_list_dialog(lst, callback):
    top = Toplevel()
    top.minsize(400, 500)
    top.title(u"姆咪名單")

    Label(top, text=u"即將發送 P 幣給以下鄉民：").pack()

    list_area = ScrolledText.ScrolledText(
        master=top,
        wrap=WORD,
        width=20,
        height=40
    )

    for name in lst:
        list_area.insert(END, "{}\n".format(name))

    list_area.configure(state="disabled")
    list_area.pack()

    def go():
        top.destroy()
        callback()

    go_button = Button(top, text=u"取消", command=top.destroy)
    go_button.pack(side=RIGHT)

    go_button = Button(top, text=u"確定", command=go)
    go_button.pack(side=RIGHT)


def show_error(title, msg):
    tkMessageBox.showerror(title, msg)
