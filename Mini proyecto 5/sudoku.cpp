#include <iostream>
#include <ctime>
#include <cstdlib>
#include <random>
#include <string>
using namespace std;

const int TAM = 9;
const int NIVELES = 25;
int sudoku[NIVELES][TAM][TAM];
int solucion[NIVELES][TAM][TAM];
int vidas = 3;
int vidasMax = 3;

mt19937 rng(time(0));

int obtenerCantidadLlenos(int nivel) {
    if (nivel < 5)  { uniform_int_distribution<int> dist(36,49); return dist(rng); }
    if (nivel < 10) { uniform_int_distribution<int> dist(32,35); return dist(rng); }
    if (nivel < 15) { uniform_int_distribution<int> dist(28,31); return dist(rng); }
    if (nivel < 20) { uniform_int_distribution<int> dist(24,27); return dist(rng); }
    uniform_int_distribution<int> dist(17,23); return dist(rng);
}

bool resolverSudoku(int tablero[TAM][TAM], int fila, int col) {
    if (fila == TAM - 1 && col == TAM) return true;
    if (col == TAM) { fila++; col = 0; }
    if (tablero[fila][col] != 0) return resolverSudoku(tablero, fila, col + 1);

    uniform_int_distribution<int> dist(1,9);
    int nums[9];
    for (int i = 0; i < 9; ++i) nums[i] = i + 1;
    for (int i = 0; i < 9; ++i) swap(nums[i], nums[dist(rng) % 9]);

    for (int i = 0; i < 9; i++) {
        int num = nums[i];
        bool seguro = true;

        for (int x = 0; x < 9; x++)
            if (tablero[fila][x] == num || tablero[x][col] == num) seguro = false;

        int inicioFila = fila - fila % 3;
        int inicioCol = col - col % 3;
        for (int r = 0; r < 3; r++)
            for (int c = 0; c < 3; c++)
                if (tablero[inicioFila + r][inicioCol + c] == num) seguro = false;

        if (seguro) {
            tablero[fila][col] = num;
            if (resolverSudoku(tablero, fila, col + 1)) return true;
            tablero[fila][col] = 0;
        }
    }
    return false;
}

void generarPuzzle(int tablero[TAM][TAM], int nivel) {
    int llenos = obtenerCantidadLlenos(nivel);

    int completo[TAM][TAM] = {0};
    resolverSudoku(completo, 0, 0);

    for (int i = 0; i < TAM; i++)
        for (int j = 0; j < TAM; j++)
            solucion[nivel][i][j] = completo[i][j];

    int quitar = 81 - llenos;
    uniform_int_distribution<int> dist(0,8);

    while (quitar > 0) {
        int r = dist(rng);
        int c = dist(rng);
        if (completo[r][c] != 0) {
            completo[r][c] = 0;
            quitar--;
        }
    }

    for (int i = 0; i < TAM; i++)
        for (int j = 0; j < TAM; j++)
            sudoku[nivel][i][j] = completo[i][j];
}

void imprimirTablero(int tablero[TAM][TAM]) {
    for (int i = 0; i < TAM; i++) {
        if (i % 3 == 0) cout << "-------------------------\n";
        for (int j = 0; j < TAM; j++) {
            if (j % 3 == 0) cout << "| ";
            if (tablero[i][j] == 0) cout << ". ";
            else cout << tablero[i][j] << " ";
        }
        cout << "|\n";
    }
    cout << "-------------------------\n";
}

bool estaCompleto(int tablero[TAM][TAM]) {
    for (int i = 0; i < TAM; i++)
        for (int j = 0; j < TAM; j++)
            if (tablero[i][j] == 0) return false;
    return true;
}

void jugarNivel(int nivel) {
    cout << "\n--- Nivel " << nivel + 1 << " ---\n";
    time_t inicio = time(0);

    while (true) {
        imprimirTablero(sudoku[nivel]);
        cout << "Vidas: " << vidas << "/" << vidasMax << "\n";
        cout << "Comandos: set fila col valor | auto | salir\n> ";

        string comando;
        cin >> comando;

        if (comando == "set") {
            int r, c, v;
            cin >> r >> c >> v;

            if (r < 1 || r > 9 || c < 1 || c > 9 || v < 1 || v > 9) {
                cout << "Valor fuera de rango.\n";
                continue;
            }

            if (solucion[nivel][r - 1][c - 1] == v) {
                sudoku[nivel][r - 1][c - 1] = v;
                cout << "✔ Correcto.\n";
            } else {
                cout << "Incorrecto. Pierdes una vida.\n";
                vidas--;
                if (vidas <= 0) {
                    cout << "Te quedaste sin vidas. Fin del juego.\n";
                    exit(0);
                }
            }

            if (estaCompleto(sudoku[nivel])) {
                time_t fin = time(0);
                cout << "\n Sudoku completado en " << difftime(fin, inicio) << " segundos.\n";
                break;
            }
        }
        else if (comando == "auto") {
            for (int i = 0; i < TAM; i++)
                for (int j = 0; j < TAM; j++)
                    sudoku[nivel][i][j] = solucion[nivel][i][j];

            time_t fin = time(0);
            cout << "Sudoku resuelto automáticamente.\n";
            imprimirTablero(sudoku[nivel]);
            cout << "⏱ Tiempo: " << difftime(fin, inicio) << " segundos.\n";
            break;
        }
        else if (comando == "salir") {
            cout << "Saliendo del juego.\n";
            exit(0);
        }
        else {
            cout << "Comando no reconocido.\n";
        }
    }
}

int main() {
    cout << "Bienvenido a Sudoku\n";
    cout << "Generando tableros...\n";

    for (int i = 0; i < NIVELES; i++) {
        generarPuzzle(sudoku[i], i);
    }

    for (int i = 0; i < NIVELES; i++) {
        jugarNivel(i);

        if ((i + 1) % 5 == 0) {
            cout << "\n Completaste un bloque de dificultad.\n";
            if (vidas == vidasMax) {
                vidasMax++;
                cout << "¡Ganas una vida máxima adicional! Ahora tu máximo es " << vidasMax << "\n";
            }
            vidas = vidasMax;
        }
    }

    cout << "\n🎉 ¡Felicidades! Completaste todos los niveles.\n";
    return 0;
}
