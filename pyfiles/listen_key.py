import json
import os
from pynput import keyboard
from pyfiles.execute import executar_comandos
import time

def read_json_file(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

def on_press(key, bot_data_list, json_file_path, last_modified_time):
    current_modified_time = os.path.getmtime(json_file_path)
    if current_modified_time > last_modified_time:
        bot_data_list.clear()
        bot_data_list.extend(read_json_file(json_file_path))
        last_modified_time = current_modified_time

    try:
        key_str = key.char
        for bot_data in bot_data_list:
            if "key" in bot_data["call"]:
                try: 
                    hex_value = bot_data["call"]["key"].replace("\\x", "")
                    bot_key = chr(int(hex_value, 16))
                    if key_str == bot_key:  # Corrigido para comparar com key_str
                        print(key_str)
                        command_path = bot_data["path"]
                        print(f"Chamando o comando: execute('{command_path}')")
                        executar_comandos(command_path)
                except:
                    pass
    except AttributeError:
        pass

def on_release(key):
    pass

def key():
    json_file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'json_bots', 'bots.json'))
    bot_data_list = read_json_file(json_file_path)
    last_modified_time = os.path.getmtime(json_file_path)

    with keyboard.Listener(
            on_press=lambda key: on_press(key, bot_data_list, json_file_path, last_modified_time),
            on_release=on_release) as listener:
        listener.join()

if __name__ == "__main__":
    key()
