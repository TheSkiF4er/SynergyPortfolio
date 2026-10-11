package javafundamentals.syntax;

import java.math.BigDecimal;
import java.math.MathContext;
import java.util.Scanner;

/** Тема 2. Пять самостоятельных упражнений, запускаемых аргументом команды. */
public final class Main {
    private Main() {}

    public static int remainder(int a, int b) { return a % b; }

    public static String vector(int x1, int y1, int x2, int y2) {
        return "X=" + ((long) x2 - x1) + " Y=" + ((long) y2 - y1);
    }

    public static BigDecimal increase15(BigDecimal input) {
        return input.multiply(new BigDecimal("1.15"));
    }

    public static BigDecimal calculate(BigDecimal left, BigDecimal right, String operator) {
        return switch (operator) {
            case "+" -> left.add(right);
            case "-" -> left.subtract(right);
            case "*" -> left.multiply(right);
            case "/" -> left.divide(right, MathContext.DECIMAL128);
            default -> throw new IllegalArgumentException("Неизвестный оператор: " + operator);
        };
    }

    private static String format(BigDecimal value) {
        return value.stripTrailingZeros().toPlainString();
    }

    public static void main(String[] args) {
        if (args.length != 1) {
            System.err.println("Использование: Main variables|remainder|vector|percentage|calculator");
            System.exit(2);
        }
        try (Scanner input = new Scanner(System.in)) {
            switch (args[0]) {
                case "variables" -> {
                    String name = "Алексей";
                    int age = 25;
                    String city = "Москва";
                    System.out.println(name + ", " + age + ", " + city);
                }
                case "remainder" -> System.out.println(remainder(15, 6));
                case "vector" -> System.out.println(vector(input.nextInt(), input.nextInt(), input.nextInt(), input.nextInt()));
                case "percentage" -> System.out.println(format(increase15(input.nextBigDecimal())));
                case "calculator" -> {
                    BigDecimal a = input.nextBigDecimal();
                    BigDecimal b = input.nextBigDecimal();
                    System.out.println(format(calculate(a, b, input.next())));
                }
                default -> throw new IllegalArgumentException("Неизвестное упражнение: " + args[0]);
            }
        } catch (RuntimeException e) {
            System.err.println("Ошибка ввода или вычисления: " + e.getMessage());
            System.exit(1);
        }
    }
}
