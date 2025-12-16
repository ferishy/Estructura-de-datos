import pygame
import sys
import random
import os

TAM_CELDA = 20
COLUMNAS = 30
FILAS = 20
ANCHO = TAM_CELDA * COLUMNAS
ALTO = TAM_CELDA * FILAS
FPS_BASE = 10

COLOR_FONDO = (10, 10, 10)
COLOR_SERPIENTE = (0, 200, 0)
COLOR_CABEZA = (0, 255, 100)
COLOR_COMIDA = (200, 0, 0)
COLOR_TRAMPA = (255, 150, 0)
COLOR_TEXTO = (240, 240, 240)

pygame.init()
pantalla = pygame.display.set_mode((ANCHO, ALTO + 80))
pygame.display.set_caption("SNAKE")
reloj = pygame.time.Clock()
fuente = pygame.font.SysFont(None, 28)
fuente_grande = pygame.font.SysFont(None, 48)

def cargar_scores():
    if not os.path.exists("scores.txt"):
        return []
    with open("scores.txt", "r") as f:
        scores = [int(x) for x in f.read().split()]
    return sorted(scores, reverse=True)[:3]

def guardar_score(score):
    scores = cargar_scores()
    scores.append(score)
    scores.sort(reverse=True)
    scores = scores[:3]
    with open("scores.txt", "w") as f:
        f.write("\n".join(str(s) for s in scores))

def posicion_aleatoria(excluir):
    while True:
        pos = (random.randrange(COLUMNAS), random.randrange(FILAS))
        if pos not in excluir:
            return pos

def dibujar_celda(pos, color):
    x, y = pos
    rect = pygame.Rect(x * TAM_CELDA, y * TAM_CELDA, TAM_CELDA, TAM_CELDA)
    pygame.draw.rect(pantalla, color, rect)

def dibujar_texto(texto, fuente_usada, pos):
    surf = fuente_usada.render(texto, True, COLOR_TEXTO)
    pantalla.blit(surf, pos)

# juego inicial
def nuevo_juego():
    inicio_x = COLUMNAS // 2
    inicio_y = FILAS // 2
    serpiente = [(inicio_x - i, inicio_y) for i in range(5)]
    direccion = (1, 0)

    # comida
    comidas = [posicion_aleatoria(serpiente)]
    
    # trampas
    trampas = [posicion_aleatoria(serpiente + comidas) for _ in range(3)]

    puntos = 0
    nivel = 1
    velocidad = FPS_BASE
    tam_objetivo = 10

    return serpiente, direccion, comidas, trampas, puntos, nivel, velocidad, tam_objetivo

serpiente, direccion, comidas, trampas, puntos, nivel, velocidad, tam_objetivo = nuevo_juego()
proxima_direccion = direccion
game_over = False
pausa = False
tiempo_inicio = pygame.time.get_ticks()

# loop
while True:
    for evento in pygame.event.get():
        if evento.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

        if evento.type == pygame.KEYDOWN:
            if evento.key in (pygame.K_UP, pygame.K_w) and direccion != (0, 1):
                proxima_direccion = (0, -1)
            elif evento.key in (pygame.K_DOWN, pygame.K_s) and direccion != (0, -1):
                proxima_direccion = (0, 1)
            elif evento.key in (pygame.K_LEFT, pygame.K_a) and direccion != (1, 0):
                proxima_direccion = (-1, 0)
            elif evento.key in (pygame.K_RIGHT, pygame.K_d) and direccion != (-1, 0):
                proxima_direccion = (1, 0)
            elif evento.key == pygame.K_p:
                pausa = not pausa
            elif evento.key == pygame.K_r and game_over:
                serpiente, direccion, comidas, trampas, puntos, nivel, velocidad, tam_objetivo = nuevo_juego()
                proxima_direccion = direccion
                game_over = False
                tiempo_inicio = pygame.time.get_ticks()
            elif evento.key == pygame.K_ESCAPE:
                pygame.quit()
                sys.exit()

    if not game_over and not pausa:

        direccion = proxima_direccion
        dx, dy = direccion
        cabeza_x, cabeza_y = serpiente[0]
        nueva_cabeza = ((cabeza_x + dx) % COLUMNAS, (cabeza_y + dy) % FILAS)

        # colisión propia
        if nueva_cabeza in serpiente:
            game_over = True
            guardar_score(puntos)

        serpiente.insert(0, nueva_cabeza)

        # comida
        comido = False
        for c in comidas:
            if nueva_cabeza == c:
                puntos += 1
                comidas.remove(c)
                comidas.append(posicion_aleatoria(serpiente + comidas + trampas))
                comido = True
                break

        if not comido:
            serpiente.pop()

        # trampas
        for t in trampas:
            if nueva_cabeza == t:
                puntos = max(0, puntos - 1)

                if len(serpiente) > 2:
                    serpiente.pop()
                else:
                    game_over = True

                trampas.remove(t)
                trampas.append(posicion_aleatoria(serpiente + comidas))
                break

        # subir nivel
        if len(serpiente) >= tam_objetivo:
            nivel += 1
            velocidad = int(velocidad * 1.10)
            serpiente = serpiente[:5]
            tam_objetivo = 10

    # dibujar
    pantalla.fill(COLOR_FONDO)

    for c in comidas:
        dibujar_celda(c, COLOR_COMIDA)

    for trampa in trampas:
        dibujar_celda(trampa, COLOR_TRAMPA)

    for i, parte in enumerate(serpiente):
        dibujar_celda(parte, COLOR_CABEZA if i == 0 else COLOR_SERPIENTE)

    tiempo_transcurrido = (pygame.time.get_ticks() - tiempo_inicio) // 1000

    # HUD
    hud = pygame.Rect(0, ALTO, ANCHO, 80)
    pygame.draw.rect(pantalla, (20, 20, 20), hud)

    dibujar_texto(f"Puntos: {puntos}", fuente, (10, ALTO + 10))
    dibujar_texto(f"Tiempo: {tiempo_transcurrido}s", fuente, (150, ALTO + 10))
    dibujar_texto(f"Nivel: {nivel}", fuente, (300, ALTO + 10))

    top3 = cargar_scores()
    dibujar_texto("TOP 3:", fuente, (450, ALTO + 5))

    for i, ts in enumerate(top3):
        dibujar_texto(f"{i+1}. {ts}", fuente, (450, ALTO + 30 + i*20))

    # GAME OVER
    if game_over:
        go = fuente_grande.render("¡GAME OVER!", True, (255, 80, 80))
        rect = go.get_rect(center=(ANCHO // 2, ALTO // 2 - 20))
        pantalla.blit(go, rect)

        info = fuente.render("Presiona R para reiniciar", True, COLOR_TEXTO)
        rect2 = info.get_rect(center=(ANCHO // 2, ALTO // 2 + 20))
        pantalla.blit(info, rect2)

    pygame.display.flip()
    reloj.tick(velocidad)
