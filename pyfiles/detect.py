# -*- coding: utf-8 -*-
import argparse
import os
from pynput import mouse, keyboard
import json
from windows_toasts import Toast, WindowsToaster

import webview

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
        command = {
            'type': 'click',
            'x': x,
            'y': y,
            'button': str(button),
            'pressed': pressed
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
        'pressed': True
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