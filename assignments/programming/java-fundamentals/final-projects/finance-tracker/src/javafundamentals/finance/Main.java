package javafundamentals.finance;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Path;
import java.util.Scanner;
import java.util.UUID;

public final class Main {
    private Main() {}
    private static String ask(Scanner input, String label) {
        System.out.print(label + ": ");
        return input.nextLine().trim();
    }

    public static void main(String[] args) {
        Path file = Path.of(args.length > 0 ? args[0] : "finance.tsv");
        try (Scanner input = new Scanner(System.in)) {
            FinanceTracker tracker = FinanceStorage.load(file);
            while (true) {
                System.out.println("\n1 Добавить | 2 Список | 3 Итог | 4 По категории | 5 Удалить | 0 Выход");
                String command = ask(input, "Команда");
                if (command.equals("0")) return;
                boolean changed = false;
                try {
                    switch (command) {
                        case "1" -> {
                            Transaction added = tracker.add(new BigDecimal(ask(input, "Сумма (+ доход / - расход)")), ask(input, "Категория"));
                            System.out.println("Добавлено: " + added);
                            changed = true;
                        }
                        case "2" -> tracker.all().forEach(System.out::println);
                        case "3" -> System.out.println("Итог: " + tracker.total().toPlainString());
                        case "4" -> tracker.byCategory(ask(input, "Категория")).forEach(System.out::println);
                        case "5" -> {
                            changed = tracker.remove(UUID.fromString(ask(input, "UUID")));
                            System.out.println(changed ? "Удалено" : "Транзакция не найдена");
                        }
                        default -> System.out.println("Неизвестная команда");
                    }
                    if (changed) FinanceStorage.save(tracker, file);
                } catch (IllegalArgumentException e) { System.out.println("Ошибка: " + e.getMessage()); }
            }
        } catch (IOException e) {
            System.err.println("Ошибка файла финансов: " + e.getMessage());
            System.exit(1);
        }
    }
}
