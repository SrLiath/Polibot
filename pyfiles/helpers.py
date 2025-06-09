import threading


def thread(funcao, *args, **kwargs):
    def wrapper():
        funcao(*args, **kwargs)
    
    thread = threading.Thread(target=wrapper, daemon=True)
    thread.start()