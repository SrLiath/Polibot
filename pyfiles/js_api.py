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

    def apagarBot(self, path, botname):
        os.remove(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'json_bots', botname + '.json')))
        
        path_bots = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'json_bots', 'bots.json'))
        with open(path_bots, 'r') as arquivo:
            dados = json.load(arquivo)

        for item in dados[:]:  # Usando [:] para criar uma cópia da lista
            if item['botname'] == botname:
                dados.remove(item)

        with open(path_bots, 'w') as arquivo:
            json.dump(dados, arquivo, indent=4)


        return True
    
    def detect(self, options):
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
        try:
            data_str = json.dumps(data) 
            js_code = f"window.receiveData({json.dumps(data_str)});"
            print(f"Executing JavaScript: {js_code}")  # Debug print
            webview.windows[0].evaluate_js(js_code)
        except Exception as e:
            print(f"Error sending data to HTML: {e}")

    def confirm(self):
        pass
