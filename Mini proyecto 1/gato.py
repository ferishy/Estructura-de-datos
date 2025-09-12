import random

def mostrar_tablero(tablero):
    print("\n")
    print(f"{tablero[0]} | {tablero[1]} | {tablero[2]}")
    print("--+---+--")
    print(f"{tablero[3]} | {tablero[4]} | {tablero[5]}")
    print("--+---+--")
    print(f"{tablero[6]} | {tablero[7]} | {tablero[8]}")
    print("\n")

def ganador(tablero, simbolo):
    combinaciones = [(0,1,2),(3,4,5),(6,7,8),(0,3,6),(1,4,7),(2,5,8),(0,4,8),(2,4,6)]
    return any(tablero[a]==tablero[b]==tablero[c]==simbolo for a,b,c in combinaciones)


jugador1 = input("Nombre del jugador 1 (X): ")
jugador2 = input("Nombre del jugador 2 (O): ")

tablero = ['1','2','3','4','5','6','7','8','9']
if random.choice([True, False]):
    turno_jugador = jugador1
    simbolo = 'X'
else:
    turno_jugador = jugador2
    simbolo = 'O'

for i in range(9):
    mostrar_tablero(tablero)
    print(f"Turno de {turno_jugador} ({simbolo})")
    while True:
        pos = input("Elige un número (1-9): ")
        if pos.isdigit() and int(pos) in range(1,10) and tablero[int(pos)-1] not in ['X','O']:
            tablero[int(pos)-1] = simbolo
            break
        else:
            print("Movimiento inválido, intenta de nuevo.")

    if ganador(tablero, simbolo):
        mostrar_tablero(tablero)
        print(f"¡{turno_jugador} ha ganado!")
        break

    # Cambiar turno
    if simbolo == 'X':
        simbolo = 'O'
        turno_jugador = jugador2
    else:
        simbolo = 'X'
        turno_jugador = jugador1
else:
    mostrar_tablero(tablero)
    print("¡Empate!")
