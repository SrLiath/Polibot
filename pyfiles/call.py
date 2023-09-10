import server
import detect
import hear
import execute

def server_():
    server.start()
def detect_(nome, call, type):
    detect.gravar(nome, call, type)
def hear_():
    hear.ouvir_audio()
def execute_(filename):
    execute.executar_comandos(filename)
