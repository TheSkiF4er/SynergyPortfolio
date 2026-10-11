package javafundamentals.exceptions;

import java.io.PrintStream;
import java.util.Scanner;

/** Ловим ошибки локально: ноль пропускается, выход за массив завершает цикл. */
public final class Main {
    private Main() {}

    public static void divideArray(int[] values, PrintStream out) {
        int i = 0;
        while (true) {
            try {
                out.println(i / values[i]);
            } catch (ArithmeticException exception) {
                out.println("Деление на ноль запрещено");
            } catch (ArrayIndexOutOfBoundsException exception) {
                out.println("Программа успешно завершена");
                break;
            }
            i++;
        }
    }

    public static void main(String[] args) {
        int[] numbers = new int[3];
        try (Scanner input = new Scanner(System.in)) {
            for (int i = 0; i < numbers.length; i++) numbers[i] = input.nextInt();
            divideArray(numbers, System.out);
        } catch (RuntimeException e) {
            System.err.println("Необходимо ввести три целых числа: " + e.getMessage());
            System.exit(1);
        }
    }
}
