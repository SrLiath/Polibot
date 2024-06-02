import json
import os
import time
import webview
from pyfiles.detect import gravar

class MyJSAPI:
    def close(self):
        webview.windows[0].destroy()

    def minimize(self):
        webview.windows[0].minimize()

    def fullscreen(self):
        webview.windows[0].toggle_fullscreen()
    
    def detect(self,options):
        if 'Key' in options:
            call = options['Key']
        else:
            call = options['Voice']

        gravar(options['Name'], call, options['Option'])
        
    def ready(self):
        caminho_arquivo = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'json_bots', 'bots.json'))
        ultima_modificacao = os.path.getmtime(caminho_arquivo)        
        with open(caminho_arquivo, "r") as arquivo:
            dados_json = json.load(arquivo)
            self.send_data_to_html(dados_json)
        while True:
            if os.path.getmtime(caminho_arquivo) > ultima_modificacao:
                ultima_modificacao = os.path.getmtime(caminho_arquivo)        
                with open(caminho_arquivo, "r") as arquivo:
                    dados_json = json.load(arquivo)
                self.send_data_to_html(dados_json)
                ultima_modificacao = os.path.getmtime(caminho_arquivo)
            
            time.sleep(1)
        
    def send_data_to_html(self, data):
        data_str = json.dumps(data) 
        js_code = f"window.receiveData('{data_str}');"
        webview.windows[0].evaluate_js(js_code)
        
    def confirm(self):
        pass