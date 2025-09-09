package recorridos_array;

public class java {
    public static void main(String[] args) {
        int[] numeros = {10, 20, 30};

        for (int i = 0; i < numeros.length; i++)
            System.out.println(numeros[i]);

        for (int i = numeros.length - 1; i >= 0; i--)
            System.out.println(numeros[i]);
    }
}