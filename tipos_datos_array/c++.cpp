#include <iostream>
#include <string>
using namespace std;

// Definir tipo personalizado
struct Persona {
    string nombre;
    int edad;
};

int main() {
    // Declarar un array del tipo personalizado
    Persona personas[2] = {
        {"Fer", 22},
        {"Omar", 23}
    };

    cout << personas[0].nombre << endl; 
    return 0;
}
