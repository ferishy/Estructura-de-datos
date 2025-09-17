using System;

class Program
{
    static char[,] tablero = new char[6, 7];

    static void Main()
    {
        // Inicializar tablero
        for (int i = 0; i < 6; i++)
        {
            for (int j = 0; j < 7; j++)
            {
                tablero[i, j] = '.';
            }
        }

        char jugador = 'X';
        bool juegoActivo = true;

        while (juegoActivo)
        {
            // Imprimir tablero
            for (int i = 0; i < 6; i++)
            {
                for (int j = 0; j < 7; j++)
                {
                    Console.Write(tablero[i, j] + " ");
                }
                Console.WriteLine();
            }
            Console.WriteLine("0 1 2 3 4 5 6");

            Console.Write("Jugador " + jugador + ", elige columna (0-6): ");
            string entrada = Console.ReadLine();
            int columna = int.Parse(entrada); 

            // Insertar ficha
            bool colocada = false;
            for (int i = 5; i >= 0; i--)
            {
                if (tablero[i, columna] == '.')
                {
                    tablero[i, columna] = jugador;
                    colocada = true;
                    break;
                }
            }

            if (!colocada)
            {
                Console.WriteLine("Columna llena, intenta de nuevo.");
                continue; // vuelve a pedir columna
            }

            // Comprobar si ganó
            if (HayGanador(jugador))
            {
                for (int i = 0; i < 6; i++)
                {
                    for (int j = 0; j < 7; j++)
                    {
                        Console.Write(tablero[i, j] + " ");
                    }
                    Console.WriteLine();
                }
                Console.WriteLine("¡Jugador " + jugador + " gana!");
                juegoActivo = false;
            }
            else
            {
                // Cambiar de jugador
                if (jugador == 'X')
                    jugador = 'O';
                else
                    jugador = 'X';
            }
        }
    }

    static bool HayGanador(char j)
    {
        // Horizontal
        for (int i = 0; i < 6; i++)
        {
            for (int c = 0; c < 4; c++)
            {
                if (tablero[i, c] == j && tablero[i, c + 1] == j &&
                    tablero[i, c + 2] == j && tablero[i, c + 3] == j)
                    return true;
            }
        }

        // Vertical
        for (int i = 0; i < 3; i++)
        {
            for (int c = 0; c < 7; c++)
            {
                if (tablero[i, c] == j && tablero[i + 1, c] == j &&
                    tablero[i + 2, c] == j && tablero[i + 3, c] == j)
                    return true;
            }
        }

        // Diagonal derecha
        for (int i = 0; i < 3; i++)
        {
            for (int c = 0; c < 4; c++)
            {
                if (tablero[i, c] == j && tablero[i + 1, c + 1] == j &&
                    tablero[i + 2, c + 2] == j && tablero[i + 3, c + 3] == j)
                    return true;
            }
        }

        // Diagonal izquierda
        for (int i = 0; i < 3; i++)
        {
            for (int c = 3; c < 7; c++)
            {
                if (tablero[i, c] == j && tablero[i + 1, c - 1] == j &&
                    tablero[i + 2, c - 2] == j && tablero[i + 3, c - 3] == j)
                    return true;
            }
        }

        return false;
    }
}