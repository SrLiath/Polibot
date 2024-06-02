import speech_recognition as sr
import os
import json

from pyfiles.execute import executar_comandos

def ouvir_audio():
    r = sr.Recognizer()

    while True:
        with sr.Microphone() as source:
            r.adjust_for_ambient_noise(source, duration=1)
            print("Ouvindo...")
            audio = r.listen(source)
        try:
            texto = r.recognize_google(audio, language='pt-BR')
            print(f"Você disse: {texto}")
            
            # Lê o arquivo JSON com os comandos
            with open(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'json_bots', 'bots.json')), 'r') as f:
                commands = json.load(f)
            
            for command in commands:
                if 'call' in command and 'voice' in command['call']:
                    palavra = command['call']['voice']
                    filename = command['path']
                    if texto.lower() == palavra.lower():
                        if os.path.isfile(filename):
                             executar_comandos.execute_(filename)
                        else:
                            print(f"Arquivo não encontrado: {filename}")

        except sr.UnknownValueError:
            print("Não entendi o que você disse.")
        except sr.RequestError as e:
            print(f"Não foi possível completar a requisição: {e}")
if __name__ == "__main__":
    ouvir_audio()
