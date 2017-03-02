from ptt_coin_bot import auto_give_money


def test_give_money():
    money_count = 10
    targets = ['lintsu', 'lintsu']
    auto_give_money(money_count, targets)


if __name__ == '__main__':
    test_give_money()
