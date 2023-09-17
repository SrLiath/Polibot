import call
import threading


if __name__ == "__main__":
    # Thread para ouvir a voz
    ouvir = threading.Thread(target=call.hear_)
    ouvir.start()
    # Thread para detectar teclas
    teclas = threading.Thread(target=call.listen_)
    teclas.start()
    # Inicia o servidor
    call.server_()

    