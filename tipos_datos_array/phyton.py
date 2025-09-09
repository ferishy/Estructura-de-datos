# Definir tipo personalizado
class Persona:
    def __init__(self, nombre, edad):
        self.nombre = nombre
        self.edad = edad

# Declarar un array (lista) del tipo personalizado
personas = [
    Persona("Fer", 22),
    Persona("Omar", 23)
]

print(personas[0].nombre)  
