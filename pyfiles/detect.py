# -*- coding: utf-8 -*-
import argparse
import os
from pynput import mouse, keyboard
import json
from windows_toasts import Toast, WindowsToaster
import webview
import pyautogui
from PIL import Image
import base64
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
import os
import psutil
from datetime import datetime

def get_mac_address():
    interfaces = psutil.net_if_addrs()
    for interface in interfaces.values():
        for addr in interface:
            if addr.family == 17: 
                return addr.address
    return None

def encrypt_image(image_data, key):
    cipher = AES.new(key, AES.MODE_CBC)
    ct_bytes = cipher.encrypt(pad(image_data, AES.block_size))
    return cipher.iv + ct_bytes  

def capture_and_save_image():
    screenshot = pyautogui.screenshot()
    screenshot = screenshot.resize((screenshot.width // 2, screenshot.height // 2))
    image_bytes = screenshot.tobytes()
    mac_address = get_mac_address()
    if mac_address is None:
        print("Não foi possível obter o endereço MAC.")
        return
    additional_number = b"123456" 
    key_input = mac_address.encode() + additional_number
    key = key_input[:16]  
    encrypted_image = encrypt_image(image_bytes, key)
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S") + f"{datetime.now().microsecond}"
    with open(f"{timestamp}.dat", "wb") as f:
        f.write(encrypted_image)
    return f"{timestamp}.dat"
    
commands = []
mouse_listener = None
keyboard_listener = None
# def on_move(x, y):
#     command = {
#         'type': 'move',
#         'x': x,
#         'y': y
#     }
#     commands.append(command)

def on_click(x, y, button, pressed):
    global commands
    if pressed:
        ft = capture_and_save_image()
        command = {
            'type': 'click',
            'x': x,
            'y': y,
            'button': str(button),
            'pressed': pressed,
            'sleep': 0,
            'ft': ft
        }
        commands.append(command)

# def on_press(key):
#     try:
#         command = {
#             'type': 'keypress',
#             'key': key.char,
#             'pressed': True
#         }
#         commands.append(command)
#     except AttributeError:
#         command = {
#             'type': 'keypress',
#             'key': key.name,
#             'pressed': True
#         }
#         commands.append(command)

def on_release(key):
    global commands, mouse_listener, keyboard_listener
    
    try:
        key_name = key.char
    except AttributeError:
        key_name = key.name
    if key == keyboard.Key.esc:
        webview.windows[0].show()
        try:
            toaster = WindowsToaster('Polibot')
            newToast = Toast()
            newToast.text_fields = ['Bot gravado com sucesso!']
            newToast.on_activated = lambda _: webview.windows[0].show()
            toaster.show_toast(newToast)
            if mouse_listener is not None:
                mouse_listener.stop()
            if keyboard_listener is not None:
                keyboard_listener.stop()
        except:
            pass
        return False
    command = {
        'type': 'keypress',
        'key': key_name,
        'pressed': True,
        'sleep': 0
    }
    commands.append(command)


def gravar(nome, call, type, loop):
    global commands, mouse_listener, keyboard_listener
    mouse_listener = mouse.Listener(
        # on_move=on_move,
        on_click=on_click)
    mouse_listener.start()
    
    keyboard_listener = keyboard.Listener(
        # on_press=on_press,
        on_release=on_release)
    keyboard_listener.start()
    
    keyboard_listener.join()
    filename = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'json_bots', nome + '.json'))
    with open(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'json_bots', 'bots.json')), 'r', encoding='utf-8') as arquivo_json:
        dados_existente = json.load(arquivo_json)
    print(type)
    if type == 0:
        caller = "key"
    elif type == 1:
        caller = "voice"
    botJson = {
        "path": filename,
        "botname": nome,
        "loop": int(loop),
        "call": {
            caller: call
        }
    }

    

    dados_existente.append(botJson)
    with open(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'json_bots', 'bots.json')), 'w', encoding='utf-8') as arquivo_json:
        json.dump(dados_existente, arquivo_json, indent=4)

    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(commands, file, indent=4)
    commands.clear()