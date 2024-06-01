import threading


def thread(funcao):
    thread = threading.Thread(target=funcao)
    thread.daemon = True
    thread.start()