# -*- coding: utf-8 -*-
import argparse
from pynput import mouse, keyboard
import json
from windows_toasts import Toast, WindowsToaster

import webview

commands = []

# def on_move(x, y):
#     command = {
#         'type': 'move',
#         'x': x,
#         'y': y
#     }
#     commands.append(command)

def on_click(x, y, button, pressed):
    command = {
        'type': 'click',
        'x': x,
        'y': y,
        'button': str(button),
        'pressed': pressed
    }
    commands.append(command)

def on_press(key):
    try:
        command = {
            'type': 'keypress',
            'key': key.char,
            'pressed': True
        }
        commands.append(command)
    except AttributeError:
        command = {
            'type': 'keypress',
            'key': key.name,
            'pressed': True
        }
        commands.append(command)

def on_release(key):
    try:
        key_name = key.char
    except AttributeError:
        key_name = key.name

    command = {
        'type': 'keypress',
        'key': key_name,
        'pressed': False
    }
    commands.append(command)
    if key == keyboard.Key.esc:
        webview.windows[0].show()
        try:
            toaster = WindowsToaster('Polibot')
            newToast = Toast()
            newToast.text_fields = ['Bot gravado com sucesso!']
            newToast.on_activated = lambda _: webview.windows[0].show()
            toaster.show_toast(newToast)
        except:
            pass
        return False

def gravar(nome, call, type):
    print('Gravador de comandos iniciado. Pressione Esc para parar.')

    
    mouse_listener = mouse.Listener(
        # on_move=on_move,
        on_click=on_click)
    mouse_listener.start()
    
    keyboard_listener = keyboard.Listener(
        on_press=on_press,
        on_release=on_release)
    keyboard_listener.start()
    
    keyboard_listener.join()
    filename = '.\\json_bots\\'
    filename += nome + '.json'



    with open('.\\json_bots\\bots.json', 'r', encoding='utf-8') as arquivo_json:
        dados_existente = json.load(arquivo_json)
    print(type)
    if type == 0:
        caller = "key"
    elif type == 1:
        caller = "voice"
    botJson = {
        "path": filename,
        "botname": nome,
        "call": {
            caller: call
        }
    }

    # Adicione o novo objeto à lista existente
    dados_existente.append(botJson)
    # Escreva os dados atualizados de volta para o arquivo JSON
    with open('.\\json_bots\\bots.json', 'w', encoding='utf-8') as arquivo_json:
        json.dump(dados_existente, arquivo_json, indent=4)

    # Salve os comandos em um arquivo JSON
    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(commands, file, indent=4)

    print(f'Comandos gravados no arquivo: {filename}')
