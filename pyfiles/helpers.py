import threading

def thread(funcao):
    thread = threading.Thread(target=funcao)
    thread.daemon = True
    thread.start()

def notificar(titulo, mensagem):
    toaster = WindowsToaster("Bot Controller")
    toast = Toast()
    toast.text_fields = [titulo, mensagem]
    toaster.show_toast(toast)
