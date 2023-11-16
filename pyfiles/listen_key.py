import json
import threading
import hashlib
import time
import call
from pynput import keyboard
pressed_keys = []
def main():
    pressed_keys = []
    def calculate_json_hash(data):
        return hashlib.md5(json.dumps(data, sort_keys=True).encode()).hexdigest()

    def read_json_file(file_path):
        with open(file_path, 'r') as file:
            return json.load(file)

    def json_check_thread():
        global current_hash, key_commands
        current_hash = calculate_json_hash(bots_data)  # Initialize current_hash
        while True:
            new_bots_data = read_json_file(json_file_path)
            new_hash = calculate_json_hash(new_bots_data)
            if new_hash != current_hash:
                current_hash = new_hash
                print("O JSON mudou. Recarregando configurações.")
                key_commands = {}  # Limpa o mapeamento existente
                for bot in new_bots_data:
                    key_sequence = bot['call']['key']
                    path = bot['path']
                    key_commands[key_sequence] = path
            time.sleep(1)

    def is_sequence_in_key(key_sequence, key_str):
        keys = key_str.split('+')
        return all(k in key_sequence for k in keys)

    json_file_path = '../json_bots/bots.json'
    bots_data = read_json_file(json_file_path)
    current_hash = calculate_json_hash(bots_data)
    key_commands = {}
    for bot in bots_data:
        key_sequence = bot['call']['key']
        path = bot['path']
        key_commands[key_sequence] = path



    def on_press(key):
        global pressed_keys
        try:
            key_str = key.char
            if key_str:
                pressed_keys.append(key_str)

                for key_sequence, command in key_commands.items():
                    if is_sequence_in_key(key_sequence, '+'.join(pressed_keys)):
                        call.execute_(command)
                        print(f"Chamando o comando: execute('{command}')")
        except AttributeError:
            pass

    def on_release(key):
        global pressed_keys
        try:
            key_str = key.char
            if key_str and key_str in pressed_keys:
                pressed_keys.remove(key_str)
        except AttributeError:
            pass

    json_thread = threading.Thread(target=json_check_thread)
    json_thread.daemon = True
    json_thread.start()

    with keyboard.Listener(on_press=on_press, on_release=on_release) as listener:
        listener.join()
if __name__ == "__main__":
    main()