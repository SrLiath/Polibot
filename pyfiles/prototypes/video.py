#descontinuado
import cv2
import mediapipe as mp
from pynput import keyboard

def executar_gesto(nome_gesto):
    if nome_gesto == "gesto1":
        print("Executando código para o gesto 1")
    elif nome_gesto == "gesto2":
        print("Executando código para o gesto 2")
    else:
        print("Gesto desconhecido")

def desenhar_gestos(frame, gestos):
    if gestos:
        for gesto in gestos:
            cv2.putText(frame, gesto, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    cv2.imshow("Detecção de Gestos", frame)

mp_drawing = mp.solutions.drawing_utils
mp_hands = mp.solutions.hands

gestos_sequencia = ["gesto1", "gesto2"]  
gesto_atual = 0
sequencia_detectada = []

gravando_gesto = False
gesto_gravado = []
gesto_anterior = []

cap = cv2.VideoCapture(0)

print("Faça o gesto:", gestos_sequencia[gesto_atual])

def on_press(key):
    global gravando_gesto, gesto_gravado, gesto_anterior
    if hasattr(key, "char") and key.char == "b":
        if not gravando_gesto:
            print("Gravando gesto...")
            gesto_gravado = []
            gravando_gesto = True
        else:
            print("Gesto gravado.")
            if gesto_anterior and gesto_gravado:
                similaridade = comparar_gestos(gesto_gravado, gesto_anterior)
                if similaridade >= 0.9:
                    print("Gesto repetido.")
                    sequencia_detectada.append(gestos_sequencia[gesto_atual])
                else:
                    print("Gesto não reconhecido.")
            else:
                print("Gesto não reconhecido.")

            gesto_anterior = gesto_gravado.copy()
            gravando_gesto = False

listener = keyboard.Listener(on_press=on_press)
listener.start()
def comparar_gestos(gesto1, gesto2):
    return 0.0

with mp_hands.Hands(
        static_image_mode=False,
        max_num_hands=1,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5) as hands:

    while cap.isOpened():
        ret, frame = cap.read()

        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False

        results = hands.process(image)

        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                mp_drawing.draw_landmarks(
                    image,
                    hand_landmarks,
                    mp_hands.HAND_CONNECTIONS
                )

                if len(hand_landmarks.landmark) > 0 and gravando_gesto:
                    gesto_gravado.append(hand_landmarks.landmark)

                if len(sequencia_detectada) >= len(gestos_sequencia):
                    if sequencia_detectada[-len(gestos_sequencia):] == gestos_sequencia:
                        executar_gesto(gestos_sequencia[gesto_atual])
                        sequencia_detectada = []

                if len(sequencia_detectada) > 1:
                    gesto_atual = (gesto_atual + 1) % len(gestos_sequencia)

                desenhar_gestos(image, sequencia_detectada)

        cv2.imshow("Detecção de Gestos", image)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()
