import sys
import os
import json
import time
import pyautogui
import argparse
from pynput import keyboard
import speech_recognition as sr

from pyfiles.helpers import thread

pyautogui.FAILSAFE = False

parar = False

def press(key):
    global parar
    try:
        if key == keyboard.Key.esc:
            parar = True
            return False
    except Exception as e:
        print(f"Erro: {e}")
        
def check():
    with keyboard.Listener(
        on_press=lambda key: press(key),
        ) as listener:
        listener.join()

        
        
def executar_comandos(filename):
    global parar
    parar = False
    thread(check)
    print(f'Executando comandos do arquivo: {filename}')
    with open(filename, 'r') as file:
        commands = json.load(file)

    botname = filename.split('\\')[-1].split('.')[0]

    with open(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'json_bots', 'bots.json')), 'r') as bots:
        file = json.load(bots)

    for bot in file:
        if(bot['botname'] == botname):
            loop = bot['loop']

    for _ in range(loop):
        for command in commands:
            if parar == True:
                break
            command_type = command['type'] 

            if command_type == 'move':
                x = command['x']
                y = command['y']
                pyautogui.moveTo(x, y)
    
            elif command_type == 'click':
                x = command['x']
                y = command['y']
                button = command['button']
                pressed = command['pressed']
                time.sleep(1)  # Pausa para evitar cliques consecutivos

                if button == 'Button.left':
                    if pressed:
                        pyautogui.click(x = x, y = y, button = 'left')
                        time.sleep(0.5)
                        time.sleep(command['sleep'])
                elif button == 'Button.right':
                    if pressed:
                        pyautogui.click(x = x, y = y, button = 'right')
                        time.sleep(command['sleep'])

            elif command_type == 'keypress':
                key = command['key']
                pressed = command['pressed']
                time.sleep(0.1)  # Pausa para evitar pressionamentos consecutivos
                if pressed:
                    pyautogui.press(key)
                    time.sleep(command['sleep'])

        print('Comandos executados com sucesso.')