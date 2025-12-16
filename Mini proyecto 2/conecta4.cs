using System;

class Program
{
    static char[,] tablero = new char[6, 7];

    static void Main()
    {
        Console.Write("Nombre del jugador 1 (X): ");
        string nombre1 = Console.ReadLine();
        Console.Write("Nombre del jugador 2 (O): ");
        string nombre2 = Console.ReadLine();

        for (int i = 0; i < 6; i++)
        {
            for (int j = 0; j < 7; j++)
            {
                tablero[i, j] = '.';
            }
        }

        Random rnd = new Random();
        int turno = rnd.Next(0, 2); // 0 o 1
        char fichaActual = turno == 0 ? 'X' : 'O';

        bool juegoActivo = true;

        while (juegoActivo)
        {
            for (int i = 0; i < 6; i++)
            {
                for (int j = 0; j < 7; j++)
                {
                    Console.Write(tablero[i, j] + " ");
                }
                Console.WriteLine();
            }
            Console.WriteLine("0 1 2 3 4 5 6");

            string nombreActual = fichaActual == 'X' ? nombre1 : nombre2;
            Console.Write(nombreActual + " (" + fichaActual + "), elige columna (0-6): ");
            string entrada = Console.ReadLine();
            int columna = int.Parse(entrada); 

            bool colocada = false;
            for (int i = 5; i >= 0; i--)
            {
                if (tablero[i, columna] == '.')
                {
                    tablero[i, columna] = fichaActual;
                    colocada = true;
                    break;
                }
            }

            if (!colocada)
            {
                Console.WriteLine("Columna llena, intenta de nuevo.");
                continue; 
            }

            if (HayGanador(fichaActual))
            {
                for (int i = 0; i < 6; i++)
                {
                    for (int j = 0; j < 7; j++)
                    {
                        Console.Write(tablero[i, j] + " ");
                    }
                    Console.WriteLine();
                }
                Console.WriteLine("¡" + nombreActual + " gana!");
                juegoActivo = false;
            }
            else
            {
                fichaActual = fichaActual == 'X' ? 'O' : 'X';
            }
        }
    }

    static bool HayGanador(char j)
    {
        for (int i = 0; i < 6; i++)
        {
            for (int c = 0; c < 4; c++)
            {
                if (tablero[i, c] == j && tablero[i, c + 1] == j &&
                    tablero[i, c + 2] == j && tablero[i, c + 3] == j)
                    return true;
            }
        }

        for (int i = 0; i < 3; i++)
        {
            for (int c = 0; c < 7; c++)
            {
                if (tablero[i, c] == j && tablero[i + 1, c] == j &&
                    tablero[i + 2, c] == j && tablero[i + 3, c] == j)
                    return true;
            }
        }

        for (int i = 0; i < 3; i++)
        {
            for (int c = 0; c < 4; c++)
            {
                if (tablero[i, c] == j && tablero[i + 1, c + 1] == j &&
                    tablero[i + 2, c + 2] == j && tablero[i + 3, c + 3] == j)
                    return true;
            }
        }

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
