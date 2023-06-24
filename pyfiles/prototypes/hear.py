import sys
import speech_recognition as sr
import os

def ouvir():
    r = sr.Recognizer()

    mapeamento = {}

    # get the word passed by command line, like: hear.exe "NameBot:PathBot"
    pares = sys.argv[1:]
    for par in pares:
        palavra, caminho = par.split(':')
        mapeamento[palavra] = caminho

    while True:
        with sr.Microphone() as source:
            print("Ouvindo...")
            audio = r.listen(source)
        try:
            texto = r.recognize_google(audio, language='pt-BR')
            print(f"Você disse: {texto}")
            for palavra, caminho in mapeamento.items():
                if palavra.lower() == texto.lower():
                    if os.path.isfile(caminho):
                        os.system(f'python {caminho}')  # execute the file
                    else:
                        print(f"Arquivo não encontrado: {caminho}")
        except sr.UnknownValueError:
            print("Não entendi o que você disse.")
        except sr.RequestError as e:
            print(f"Não foi possível completar a requisição: {e}")

ouvir()
