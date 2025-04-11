# -*- coding: utf-8 -*-
import sys
import os
import json
import time
import argparse
import uiautomation as auto
from pynput import keyboard
from windows_toasts import Toast, WindowsToaster
import threading
import pyvda
import win32gui
import win32process
import subprocess
import psutil
import keyboard as kb

def get_hwnd_from_pid(pid):
    hwnds = []
    def callback(hwnd, _):
        _, found_pid = win32process.GetWindowThreadProcessId(hwnd)
        if found_pid == pid and win32gui.IsWindowVisible(hwnd):
            hwnds.append(hwnd)
        return True
    win32gui.EnumWindows(callback, None)
    return hwnds[0] if hwnds else None

def get_pid_by_name(name):
    for proc in psutil.process_iter(['pid', 'name']):
        if proc.info['name'] and proc.info['name'].lower() == name.lower():
            return proc.info['pid']
    return None

def ativar_janela(program_name):
    pid = get_pid_by_name(program_name)
    if not pid:
        print(f"Programa '{program_name}' não encontrado.")
        return False
    hwnd = get_hwnd_from_pid(pid)
    if hwnd:
        try:
            win32gui.ShowWindow(hwnd, 5)
            win32gui.SetForegroundWindow(hwnd)
            time.sleep(0.5)
            return True
        except Exception as e:
            print(f"Erro ao ativar janela: {e}")
    return False

def thread(funcao):
    t = threading.Thread(target=funcao)
    t.daemon = True
    t.start()

parar = False

def press(key):
    global parar
    if key == keyboard.Key.esc:
        parar = True
        return False

def check():
    with keyboard.Listener(on_press=press) as listener:
        listener.join()

def notificar(titulo, mensagem):
    toaster = WindowsToaster("Bot Controller")
    toast = Toast()
    toast.text_fields = [titulo, mensagem]
    toaster.show_toast(toast)

def executar_comandos(filename):
    global parar
    parar = False
    thread(check)
    print(f'Executando comandos do arquivo: {filename}')

    with open(filename, 'r') as file:
        commands = json.load(file)

    botname = os.path.basename(filename).split('.')[0]
    bot_dir = os.path.dirname(os.path.abspath(filename))
    bots_path = os.path.join(bot_dir, 'bots.json')
    with open(bots_path, 'r') as bots:
        file = json.load(bots)

    loop = None
    for bot in file:
        if bot['botname'] == botname:
            loop = bot['loop']
            break

    if loop is None:
        notificar("Bot não encontrado", f"O bot '{botname}' não está cadastrado em bots.json")
        print('Bot não encontrado.')
        return

    for _ in range(loop):
        for i, command in enumerate(commands):
            if parar:
                break

            program = command.get('program')
            if program and not get_pid_by_name(program):
                comandos_restantes = len(commands) - i
                if comandos_restantes >= 3:
                    notificar("Reiniciando bot", f"Programa '{program}' não está aberto. Faltam {comandos_restantes} comandos.")
                    print(f"Programa '{program}' não está aberto e ainda faltam {comandos_restantes} comandos. Reiniciando...")
                    os.execv(sys.executable, [sys.executable] + sys.argv)
                else:
                    notificar("Programa ausente", f"'{program}' não está aberto, mas só faltam {comandos_restantes} comandos. Ignorando.")
                    print(f"Programa '{program}' não está aberto, mas só faltam {comandos_restantes} comandos. Ignorando.")

            ativar_janela(program)

            tipo = command['type']

            if tipo == 'click':
                if command['pressed']:
                    auto.MoveTo(command['x'], command['y'])
                    control = auto.ControlFromPoint(command['x'], command['y'])
                    if command['button'] == 'Button.left':
                        control.Click()
                    else:
                        control.RightClick()

            elif tipo == 'keypress':
                if command['pressed']:
                    key = command['key']
                    special_keys = {
                        'enter', 'tab', 'esc', 'backspace', 'delete', 'space'
                    }
                    if key.lower() in special_keys:
                        kb.send(key.lower())
                    else:
                        kb.write(key, delay=0.01)

    print('Comandos executados com sucesso.')

def main():
    try:
        if args.silent and not args.internal:
            desktops = pyvda.get_virtual_desktops()
            if len(desktops) < 2:
                pyvda.VirtualDesktop.create()
                desktops = pyvda.get_virtual_desktops()

            cmd = [
                sys.executable,
                os.path.abspath(__file__),
                '--comandos', args.comandos,
                '--internal'
            ]
            process = subprocess.Popen(cmd, creationflags=subprocess.CREATE_NEW_CONSOLE)

            hwnd = None
            for _ in range(100):
                hwnd = get_hwnd_from_pid(process.pid)
                if hwnd:
                    break
                time.sleep(0.1)

            if hwnd:
                try:
                    pyvda.AppView(hwnd).move(desktops[1])
                    print("Processo movido para Desktop 2 com sucesso.")
                except Exception as e:
                    print("Erro ao mover o processo:", e)
            else:
                print("Não foi possível encontrar a janela do subprocesso.")
        else:
            executar_comandos(args.comandos)

    except Exception as e:
        print("Erro durante a execução:", e)

    if args.internal:
        input("Pressione Enter para sair...")

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--comandos', required=True)
    parser.add_argument('--silent', action='store_true')
    parser.add_argument('--internal', action='store_true')
    args = parser.parse_args()

    main()
