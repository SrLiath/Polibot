from pynput import mouse, keyboard
import json

commands = []

def on_move(x, y):
    command = {
        'type': 'move',
        'x': x,
        'y': y
    }
    commands.append(command)

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
        return False


print('Gravador de comandos iniciado. Pressione Esc para parar.')

# Listener mouse
mouse_listener = mouse.Listener(
    on_move=on_move,
    on_click=on_click)
mouse_listener.start()

# Listener keyboard
keyboard_listener = keyboard.Listener(
    on_press=on_press,
    on_release=on_release)
keyboard_listener.start()

# wait the user press the esc button to exit  
keyboard_listener.join()

# ask a name file
filename = 'json_bots/'
filename += input('Digite o nome do arquivo para salvar os comandos: ')

# save the commands in a json file
filename += '.json'
with open(filename, 'w') as file:
    json.dump(commands, file)

print(f'Comandos gravados no arquivo: {filename}')
