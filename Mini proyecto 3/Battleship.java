import java.util.*;

public class Main {

    static final int TAMANO = 10;
    static final Scanner sc = new Scanner(System.in);

    static final Barco[] FLOTA_BASE = {
            new Barco("Portaaviones", 5, 'P'),
            new Barco("Acorazado", 4, 'A'),
            new Barco("Crucero", 3, 'C'),
            new Barco("Submarino", 3, 'S'),
            new Barco("Destructor", 2, 'D')
    };

    public static void main(String[] args) {

        limpiarPantalla();
        System.out.println("=== BATTLESHIP ===");

        System.out.print("Nombre del Jugador 1: ");
        Jugador j1 = new Jugador(sc.nextLine());

        System.out.print("Nombre del Jugador 2: ");
        Jugador j2 = new Jugador(sc.nextLine());

        pausa("\nPresiona Enter para comenzar a colocar los barcos...");
        limpiarPantalla();

        System.out.println(j2.nombre + ", por favor no seas metiche..");
        pausa("Presiona Enter cuando estés listo...");
        limpiarPantalla();
        j1.colocarBarcos();

        System.out.println(j1.nombre + ", por favor no seas metiche...");
        pausa("Presiona Enter cuando estés listo...");
        limpiarPantalla();
        j2.colocarBarcos();

        pausa("Presiona Enter para comenzar la batalla...");

        Random r = new Random();
        Jugador actual = r.nextBoolean() ? j1 : j2;
        Jugador enemigo = (actual == j1) ? j2 : j1;

        int turno = 1;

        while (true) {
            limpiarPantalla();
            System.out.println("\n=== TURNO " + turno + " - " + actual.nombre.toUpperCase() + " ===");

            System.out.println("\nTU TABLERO:");
            actual.tablero.mostrar(false, actual.barcos);

            System.out.println("\nTABLERO DE " + enemigo.nombre.toUpperCase() + ":");
            enemigo.tablero.mostrar(true, enemigo.barcos, actual.disparos);

            boolean disparoValido = false;
            while (!disparoValido) {
                System.out.print("\n" + actual.nombre + ", tu disparo (ej: B5): ");
                try {
                    Posicion p = Posicion.desdeEntrada(sc.nextLine());
                    String resultado = enemigo.recibirDisparo(p, actual.disparos);
                    System.out.println(resultado);
                    disparoValido = true;

                    if (enemigo.todosHundidos()) {
                        System.out.println("\n🎉 ¡" + actual.nombre.toUpperCase() + " GANA!");
                        return;
                    }
                    pausa("\nPresiona Enter para pasar el turno...");
                } catch (IllegalArgumentException e) {
                    System.out.println(e.getMessage());
                }
            }

            Jugador temp = actual;
            actual = enemigo;
            enemigo = temp;
            turno++;
        }
    }

    static void limpiarPantalla() {
        for (int i = 0; i < 40; i++) System.out.println();
    }

    static void pausa(String msg) {
        System.out.print(msg);
        sc.nextLine();
    }

    static class Jugador {
        String nombre;
        Tablero tablero;
        boolean[][] disparos;
        List<Barco> barcos = new ArrayList<>();

        Jugador(String nombre) {
            this.nombre = nombre;
            tablero = new Tablero();
            disparos = new boolean[TAMANO][TAMANO];
        }

        void colocarBarcos() {
            System.out.println("\n=== " + nombre.toUpperCase() + ": COLOCA TUS BARCOS ===");

            for (Barco base : FLOTA_BASE) {
                boolean colocado = false;
                while (!colocado) {
                    tablero.mostrar(false, barcos);
                    System.out.println("\nColoca tu " + base.nombre + " (tamaño: " + base.tamano + ")");
                    try {
                        System.out.print("Coordenada inicial (ej: A1): ");
                        Posicion p = Posicion.desdeEntrada(sc.nextLine());

                        System.out.print("Orientación (H/V): ");
                        boolean horizontal = sc.nextLine().toUpperCase().equals("H");

                        Barco nuevo = base.copiar();
                        if (tablero.puedeColocar(nuevo, p, horizontal)) {
                            tablero.colocar(nuevo, p, horizontal);
                            barcos.add(nuevo);
                            colocado = true;
                        } else {
                            System.out.println("No se puede colocar el barco ahí.");
                        }
                    } catch (IllegalArgumentException e) {
                        System.out.println(e.getMessage());
                    }
                }
            }
            pausa("\nTodos tus barcos han sido colocados. Presiona Enter...");
            limpiarPantalla();
        }

        String recibirDisparo(Posicion p, boolean[][] disparosAtacante) {
            if (disparosAtacante[p.fila][p.col]) {
                throw new IllegalArgumentException("Ya disparaste ahí.");
            }
            disparosAtacante[p.fila][p.col] = true;

            char celda = tablero.grid[p.fila][p.col];
            if (celda == '~') return "Agua!";

            for (Barco b : barcos) {
                if (b.contiene(p)) {
                    b.impactos++;
                    if (b.estaHundido())
                        return "¡Hundiste el " + b.nombre + "!";
                    return "¡Impacto!";
                }
            }
            return "Agua!";
        }

        boolean todosHundidos() {
            for (Barco b : barcos) {
                if (!b.estaHundido()) return false;
            }
            return true;
        }
    }

    static class Tablero {
        char[][] grid = new char[TAMANO][TAMANO];

        Tablero() {
            for (int i = 0; i < TAMANO; i++) {
                Arrays.fill(grid[i], '~');
            }
        }

        boolean puedeColocar(Barco b, Posicion p, boolean h) {
            for (int i = 0; i < b.tamano; i++) {
                int r = h ? p.fila : p.fila + i;
                int c = h ? p.col + i : p.col;
                if (r >= TAMANO || c >= TAMANO || grid[r][c] != '~') {
                    return false;
                }
            }
            return true;
        }

        void colocar(Barco b, Posicion p, boolean h) {
            for (int i = 0; i < b.tamano; i++) {
                int r = h ? p.fila : p.fila + i;
                int c = h ? p.col + i : p.col;
                grid[r][c] = b.simbolo;
                b.posiciones.add(new Posicion(r, c));
            }
        }

        void mostrar(boolean ocultar, List<Barco> barcos) {
            mostrar(ocultar, barcos, new boolean[TAMANO][TAMANO]);
        }

        void mostrar(boolean ocultar, List<Barco> barcos, boolean[][] disparos) {
            System.out.print("\n  ");
            for (char c = 'A'; c <= 'J'; c++) System.out.print(c + " ");
            System.out.println();

            for (int i = 0; i < TAMANO; i++) {
                System.out.printf("%2d ", i + 1);
                for (int j = 0; j < TAMANO; j++) {

                    if (disparos[i][j]) {
                        if (grid[i][j] == '~') {
                            System.out.print("O ");
                        } else {
                            Barco encontrado = null;
                            for (Barco b : barcos) {
                                if (b.contiene(new Posicion(i, j))) {
                                    encontrado = b;
                                    break;
                                }
                            }
                            if (encontrado != null && encontrado.estaHundido()) {
                                System.out.print("🔥 ");
                            } else {
                                System.out.print("X ");
                            }
                        }
                    } else if (ocultar && grid[i][j] != '~') {
                        System.out.print("~ ");
                    } else {
                        System.out.print(grid[i][j] + " ");
                    }
                }
                System.out.println();
            }

            System.out.println("\nLeyenda: ~ Agua | O Fallo | X Impacto | 🔥 Hundido");
        }
    }

    static class Barco {
        String nombre;
        int tamano;
        char simbolo;
        int impactos = 0;
        List<Posicion> posiciones = new ArrayList<>();

        Barco(String n, int t, char s) {
            nombre = n;
            tamano = t;
            simbolo = s;
        }

        Barco copiar() {
            return new Barco(nombre, tamano, simbolo);
        }

        boolean contiene(Posicion p) {
            for (Posicion pos : posiciones) {
                if (pos.equals(p)) return true;
            }
            return false;
        }

        boolean estaHundido() {
            return impactos == tamano;
        }
    }

    static class Posicion {
        int fila, col;

        Posicion(int f, int c) {
            fila = f;
            col = c;
        }

        static Posicion desdeEntrada(String s) {
            if (s.length() < 2)
                throw new IllegalArgumentException("Coordenada inválida.");

            char letra = Character.toUpperCase(s.charAt(0));
            int col = letra - 'A';
            int fila = Integer.parseInt(s.substring(1)) - 1;

            if (col < 0 || col >= TAMANO || fila < 0 || fila >= TAMANO)
                throw new IllegalArgumentException("Coordenada fuera del tablero.");

            return new Posicion(fila, col);
        }

        @Override
        public boolean equals(Object o) {
            if (!(o instanceof Posicion)) return false;
            Posicion p = (Posicion) o;
            return fila == p.fila && col == p.col;
        }
    }
}
