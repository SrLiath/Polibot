# Polibot
Automação de processos
##COMO CONECTAR A BACK COM A FRONT
    faça as requisições ali em baixo para gravar, você pode analisar os bots dentro de json_bots/bots.json

pyfiles
===
- Init.py:
Executa todos os necessários até então
---
json_bots
--- 
- bots.json:
Dados dos bots na onde são seu filepath, name e tipo de comando (voz ou teclado)

´´´
comando curl para gravar bot:
curl localhost:3452 -H "Option: gravar" -H "Name:{nome do bot}" -H "Key: {tecla que deve ser apertada com + as separando}"
curl localhost:3452 -H "Option: gravar" -H "Name:{nome do bot}" -H "Voice: {Comando em voz que executa}"

´´´
