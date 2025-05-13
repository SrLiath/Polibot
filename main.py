import json
import os
import webview
import threading
import pystray
from pystray import MenuItem as item
from PIL import Image
from pyfiles.hear import ouvir_audio
from pyfiles.helpers import thread
from pyfiles.js_api import MyJSAPI
from pyfiles.listen_key import key

page_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'pages'))
index_file = f'file://{os.path.join(page_dir, "index.html")}'
js_api = MyJSAPI()

window = None  


def start_window():
    global window
    thread(ouvir_audio)
    thread(key)
    window = webview.create_window('CliqFácil', index_file, js_api=js_api, frameless=True, resizable=True)
    webview.start(debug=False)


def hide_window():
    if window:
        window.hide()


def show_window(icon, item):
    if window:
        window.show()


def exit_app(icon, item):
    icon.stop()
    os._exit(0)


def run_tray():
    image = Image.open("./assets/imgs/logo.png") 
    menu = (item('Mostrar', show_window), item('Sair', exit_app))
    icon = pystray.Icon("Polibot", image, "Polibot", menu)
    icon.run()


if __name__ == '__main__':
    tray_thread = threading.Thread(target=run_tray, daemon=True)
    tray_thread.start()
    start_window()
