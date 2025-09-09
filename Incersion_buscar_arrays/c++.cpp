#include <iostream>
using namespace std;

int main() {
    int numeros[5];
    numeros[0] = 10;
    numeros[1] = 20;
    numeros[2] = 30;

    int buscado = 20;
    for (int i = 0; i < 5; i++) {
        if (numeros[i] == buscado) {
            cout << "Encontrado en índice " << i << endl;
            break;
        }
    }
    return 0;
}
