import json
import os
import time
import webview
from pyfiles.hear import ouvir_audio
from pyfiles.helpers import thread
from pyfiles.js_api import MyJSAPI
from pyfiles.listen_key import key

page_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'pages'))
index_file = f'file://{os.path.join(page_dir, "index.html")}'
js_api = MyJSAPI()

def start_window():
    thread(ouvir_audio)
    thread(key)
    window = webview.create_window('Polibot', index_file, js_api=js_api, frameless=True)
    webview.start(debug=True)
    # webview.start()

if __name__ == '__main__':
    start_window()