# -*- coding: utf-8 -*-

###################################################################
#   Criado pelo gostosão jonathan Github.com/srliath              #
###################################################################
#    o funcionamento é simples seu cabaço, fiz na força do odio,  #
#   se você apagar meus comentarios eu dou shutdown no repositorio#
#   basicamente para acessar as funções você precisa enviar uma   #
#   requisição post para a porta localhost 3452 com um header de  #
#   nome 'Option', dentro dele será chamado as funções, serão elas#
#   gravar, ouvir e configurar, qualquer duvidas entrar em contato#
###################################################################

import http.server
import socketserver
import call
from io import BytesIO


# A porta, não tem erro
PORT = 3452

# Aqui fica as def com as funcoes corretas, exemplo a array funcoes tem os parametros que quando recebido retorna os dados do cabeçalho optiion
def gravar():
    print("funfou")


def start():
    # Mapeamento de opções para funções
    option_handlers = {
        'gravar': call.detect_,
    }

    class PoliServer(http.server.SimpleHTTPRequestHandler):
        def do_GET(self):
            option = self.headers.get('Option')
            handler = option_handlers.get(option)
            name = self.headers.get('Name')
            if (self.headers.get('Voice')):
                call = self.headers.get('Voice')
                type = 1
            elif(self.headers.get('Key')):
                call = self.headers.get('Key')
                type = 0
            print(call)
            if handler:
                handler(name, call, type)
            else:
                print("Opção desconhecida:", option)
    # Crie o servidor
    with socketserver.TCPServer(("", PORT), PoliServer) as httpd:
        print(f"Servidor ouvindo na porta {PORT}")
        httpd.serve_forever()