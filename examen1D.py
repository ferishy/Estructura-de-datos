numeros = [1, 2, 2, 2, 3, 4, 5, 1]

sin_duplicados=[]
for num in numeros:
    if num not in sin_duplicados:
        sin_duplicados.append(num)


print("Array sin duplicados:", sin_duplicados)