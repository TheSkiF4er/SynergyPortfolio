package javafundamentals.arrays;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Scanner;

/** Тема 3. Циклы, массивы, последовательности и сложный процент. */
public final class Main {
    private Main() {}

    public static int minimumOdd(int[] numbers) {
        int minimum = Integer.MAX_VALUE;
        boolean found = false;
        for (int number : numbers) {
            if (number % 2 != 0 && (!found || number < minimum)) {
                minimum = number;
                found = true;
            }
        }
        if (!found) throw new NoSuchElementException("В массиве нет нечётных чисел");
        return minimum;
    }

    public static String expand(int number) {
        if (number < 100 || number > 999) throw new IllegalArgumentException("Ожидается трёхзначное положительное число");
        return (number / 100 * 100) + " " + (number / 10 % 10 * 10) + " " + (number % 10);
    }

    public static String triangle(int height) {
        if (height < 1 || height > 1000) throw new IllegalArgumentException("Высота должна быть от 1 до 1000");
        StringBuilder result = new StringBuilder();
        for (int row = 1; row <= height; row++) {
            result.append("8".repeat(row));
            if (row < height) result.append('\n');
        }
        return result.toString();
    }

    public static List<BigDecimal> forecast(BigDecimal principal, BigDecimal percent) {
        if (principal.signum() <= 0 || percent.signum() <= 0) {
            throw new IllegalArgumentException("Вклад и процент должны быть положительными");
        }
        BigDecimal factor = BigDecimal.ONE.add(percent.movePointLeft(2));
        List<BigDecimal> result = new ArrayList<>();
        for (int year = 0; year < 5; year++) {
            principal = principal.multiply(factor);
            result.add(principal);
        }
        return result;
    }

    public static int longestRun(int[] array) {
        if (array.length == 0) return 0;
        int longest = 1;
        int current = 1;
        for (int i = 1; i < array.length; i++) {
            current = array[i] == array[i - 1] ? current + 1 : 1;
            longest = Math.max(current, longest);
        }
        return longest;
    }

    public static void main(String[] args) {
        if (args.length != 1) {
            System.err.println("Укажите: minimum|expand|triangle|deposit|longest-run");
            System.exit(2);
        }
        try (Scanner scanner = new Scanner(System.in)) {
            switch (args[0]) {
                case "minimum" -> {
                    System.out.println(minimumOdd(new int[]{3400, 25, 345, 234, 36, 234, 5, 32, 42, 342}));
                    System.out.println(minimumOdd(new int[]{-34, -25, -345, -234, -36, -234, -5, -32, -42, -342}));
                }
                case "expand" -> System.out.println(expand(scanner.nextInt()));
                case "triangle" -> System.out.println(triangle(10));
                case "deposit" -> {
                    for (BigDecimal amount : forecast(scanner.nextBigDecimal(), scanner.nextBigDecimal())) {
                        System.out.println(amount.stripTrailingZeros().toPlainString());
                    }
                }
                case "longest-run" -> {
                    int[] numbers = new int[10];
                    for (int i = 0; i < 10; i++) numbers[i] = scanner.nextInt();
                    System.out.println(longestRun(numbers));
                }
                default -> throw new IllegalArgumentException("Неизвестное упражнение");
            }
        } catch (RuntimeException e) {
            System.err.println("Ошибка: " + e.getMessage());
            System.exit(1);
        }
    }
}
