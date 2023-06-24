import json
import time
import pyautogui
import argparse
pyautogui.FAILSAFE = False

parser = argparse.ArgumentParser(description='Play the commands')
parser.add_argument('filename', type=str, help='Name of the json file')
args = parser.parse_args()

filename = args.filename

with open(filename, 'r') as file:
    commands = json.load(file)

print(f'Executando comandos do arquivo: {filename}')

for command in commands:
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
        time.sleep(0.1)  # Pausa para evitar cliques consecutivos

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
