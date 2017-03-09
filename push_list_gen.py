#!/usr/bin/env python
# -*- coding: utf-8 -*-

import re
import requests
import pyperclip

from HTMLParser import HTMLParser


def r18cookie(res):
    payload = {
        'from': '/bbs/gossiping/index.html',
        'yes': 'yes'
    }
    res.post('https://www.ptt.cc/ask/over18', data=payload)
    return res


class MyHTMLParser(HTMLParser):
    def __init__(self, recorder):
        HTMLParser.__init__(self)
        self.recorder = recorder
        self.flags = {'push_tag': False, 'id_tag': False}

    def handle_starttag(self, tag, attrs):
        attr_values = [attr[1] for attr in attrs]
        for v in attr_values:
            if 'push-tag' in v:
                self.flags['push_tag'] = True
                return
            elif 'push-userid' in v:
                self.flags['id_tag'] = True
                return

    def handle_endtag(self, tag):
        self.flags['push_tag'] = False
        self.flags['id_tag'] = False

    def handle_data(self, data):
        data = data.encode('utf8')
        if self.flags['push_tag']:
            p = 3
            if '推' in data:
                p = 1
            elif '噓' in data:
                p = 2
            self.recorder.send_push(p)

        elif self.flags['id_tag']:
            self.recorder.send_id(data)
        elif '發信站' in data:
            self.recorder.send_start()


class Recorder(object):
    def __init__(self):
        self.push_list = []
        self.started = False
        self.push_state = 0

    def send_push(self, state):
        if self.started:
            self.push_state = state

    def send_id(self, id):
        if self.started:
            data = {'push': self.push_state, 'id': id}
            self.push_list.append(data)

    def send_start(self):
        self.started = True

    def printout(self):
        for p in self.push_list:
            print str(p['push']) + ' : ' + p['id']


def push_list_from_url(url):
    res = requests.session()
    res = r18cookie(res)
    ptt_content = res.get(url)

    r = Recorder()
    parser = MyHTMLParser(r)
    parser.feed(ptt_content.text)

    return r.push_list


def push_list_from_clipboard():
    push_type_dict = {
        u"推": 1,
        u"噓": 2,
        u"\u2192": 3
    }

    def construct_push(line):
        words = line.split(' ')
        if len(words) < 2:
            return None

        push = re.sub('\\s', '', words[0])
        if push not in push_type_dict:
            return None
        push = push_type_dict[push]

        u_id = re.sub('\\s', '', words[1])
        if u_id[-1] != ':':
            return None
        u_id = re.sub(':', '', u_id).encode('ascii')

        return {'push': push, 'id': u_id}

    content = pyperclip.paste()
    lines = re.split('\r\n|\r|\n', content)

    return [x for x in map(construct_push, lines) if x]
