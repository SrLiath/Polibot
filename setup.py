import sys
from cx_Freeze import setup, Executable
 

build_exe_options = {"packages":['pages','pyfiles','eel','pyaudio', 'pyautogui', 'pynput', 'pystray', 'pythonnet',  'webview', 'ctypes', 'speech_recognition', 'windows_toasts'], "excludes": [],"build_exe": "C:/Users/guima/jojo/Polibot/CRIA/build/Polibot-0.0.1_win_application"}

# base="Win32GUI" should be used only for Windows GUI app
base = 'Win32GUI'

setup(
    name = "Polibot",
    version = "0.0.1",
    description = "Automação de processos",
    options = {"build_exe": build_exe_options},
    executables = [Executable("C:/Users/guima/jojo/Polibot/CRIA/main.py", base=base, icon="C:/Users/guima/jojo/Polibot/CRIA/assets/imgs/logo.ico", copyright = "Polibot",target_name="Polibot")]
)