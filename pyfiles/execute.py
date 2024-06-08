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
            time.sleep(0.2)  # Pausa para evitar cliques consecutivos

            if button == 'Button.left':
                if pressed:
                    pyautogui.mouseDown(x, y, 'left')
                else:
                    pyautogui.mouseUp(x, y, 'left')
            elif button == 'Button.right':
                if pressed:
                    pyautogui.mouseDown(x, y, 'right')
                else:
                    pyautogui.mouseUp(x, y, 'right')

        elif command_type == 'keypress':
            key = command['key']
            pressed = command['pressed']
            time.sleep(0.1)  # Pausa para evitar pressionamentos consecutivos
            if pressed:
                pyautogui.keyDown(key)
            else:
                pyautogui.keyUp(key)

    print('Comandos executados com sucesso.')