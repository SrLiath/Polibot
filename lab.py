from pynput import keyboard

ctrl_pressed = False

def on_press(key):
    global ctrl_pressed
    try:
        # Verifica se a tecla pressionada é o Ctrl e armazena em uma variável
        if key == keyboard.Key.ctrl_l:
            ctrl_pressed = True
        
        # Verifica se a combinação Ctrl + D é pressionada
        if ctrl_pressed and key == keyboard.KeyCode.from_char('\x04'):
            print("Atalho Ctrl+D pressionado!")
    
    except AttributeError:
        pass

def on_release(key):
    global ctrl_pressed
    try:
        # Se a tecla Ctrl for liberada, redefine a variável para False
        if key == keyboard.Key.ctrl_l:
            ctrl_pressed = False
    except AttributeError:
        pass

# Cria um listener para monitorar os eventos de teclado
with keyboard.Listener(on_press=on_press, on_release=on_release) as listener:
    listener.join()
