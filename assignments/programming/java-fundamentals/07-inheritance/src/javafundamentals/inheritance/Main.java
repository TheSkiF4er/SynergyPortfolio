package javafundamentals.inheritance;

import java.util.Scanner;

public final class Main {
    private Main() {}

    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            System.out.println("Имя:");
            String name = input.nextLine();
            System.out.println("Фамилия:");
            String lastname = input.nextLine();
            System.out.println("Номер сотрудника:");
            int number = Integer.parseInt(input.nextLine().trim());
            System.out.println("Номер смены:");
            int shift = Integer.parseInt(input.nextLine().trim());
            System.out.println("Почасовая ставка:");
            double rate = Double.parseDouble(input.nextLine().trim());
            ProductionWorker worker = new ProductionWorker(name, lastname, number, shift, rate);
            System.out.printf("Имя: %s%nФамилия: %s%nНомер: %d%nСмена: %d%nСтавка: %.2f%n",
                worker.getName(), worker.getLastname(), worker.getNumber(), worker.getShiftNumber(), worker.getPayment());
        } catch (IllegalArgumentException e) {
            System.err.println("Ошибка ввода: " + e.getMessage());
            System.exit(1);
        }
    }
}
