def selection_sort(fila):
    n = len(fila)
    for i in range(n - 1):
        min_index = i
        for j in range(i + 1, n):
            if fila[j] < fila[min_index]:
                min_index = j
        fila[i], fila[min_index] = fila[min_index], fila[i]
    return fila

matriz = [
    [9, 3, 5],
    [8, 1, 7],
    [6, 2, 4]
]

for i in range(len(matriz)):
    matriz[i] = selection_sort(matriz[i])

print("\nMatriz ordenada por filas:")
for fila in matriz:
    print(fila)
