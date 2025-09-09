package Incersion_buscar_arrays;

public class java {
    public static void main(String[] args) {
        int[] numeros = new int[5];
        numeros[0] = 10;
        numeros[1] = 20;
        numeros[2] = 30;

        int buscado = 20;
        for (int i = 0; i < numeros.length; i++) {
            if (numeros[i] == buscado) {
                System.out.println("Encontrado en índice " + i);
                break;
            }
        }
    }
}

