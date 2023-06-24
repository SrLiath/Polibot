import sys
import os
import json
import time
import pyautogui
import argparse
from pynput import keyboard
import speech_recognition as sr
import threading

pyautogui.FAILSAFE = False

parser = argparse.ArgumentParser(description='Play the commands')
parser.add_argument('commands', type=str, nargs='+', help='Commands to listen for in format "-a:tecla1+tecla2+...:nome_arquivo.json" or "palavra:nome_arquivo.json"')
args = parser.parse_args()

def executar_comandos(filename):
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

def on_press(key):
    try:
        texto = key.char
        print(f"Você pressionou: {texto}")
        for command in args.commands:
            if command.startswith('-a'):
                teclas = command.split(':')[1].split('+')
                filename = command.split(':')[2]
                if set(teclas) <= set(texto.lower().split()):
                    if os.path.isfile(filename):
                        executar_comandos(filename)
                    else:
                        print(f"Arquivo não encontrado: {filename}")
            else:
                palavra = command.split(':')[0]
                filename = command.split(':')[1]
                if texto.lower() == palavra.lower():
                    if os.path.isfile(filename):
                        executar_comandos(filename)
                    else:
                        print(f"Arquivo não encontrado: {filename}")
    except AttributeError:
        pass

def ouvir_teclas():
    with keyboard.Listener(on_press=on_press) as listener:
        listener.join()

def ouvir_audio():
    r = sr.Recognizer()

    while True:
        with sr.Microphone() as source:
            print("Ouvindo...")
            audio = r.listen(source)
        try:
            texto = r.recognize_google(audio, language='pt-BR')
            print(f"Você disse: {texto}")
            for command in args.commands:
                palavra = command.split(':')[0]
                filename = command.split(':')[1]
                if texto.lower() == palavra.lower():
                    if os.path.isfile(filename):
                        executar_comandos(filename)
                    else:
                        print(f"Arquivo não encontrado: {filename}")
        except sr.UnknownValueError:
            print("Não entendi o que você disse.")
        except sr.RequestError as e:
            print(f"Não foi possível completar a requisição: {e}")

# Cria as threads para ouvir as teclas e o áudio simultaneamente
thread_teclas = threading.Thread(target=ouvir_teclas)
thread_audio = threading.Thread(target=ouvir_audio)

# Inicia as threads
thread_teclas.start()
thread_audio.start()

# Aguarda o término das threads
thread_teclas.join()
thread_audio.join()
