package javafundamentals.tasks;

import java.io.IOException;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.Scanner;
import java.util.UUID;

public final class Main {
    private Main() {}
    private static String ask(Scanner input, String label) {
        System.out.print(label + ": ");
        return input.nextLine().trim();
    }

    public static void main(String[] args) {
        Path file = Path.of(args.length > 0 ? args[0] : "tasks.tsv");
        try (Scanner input = new Scanner(System.in)) {
            TaskManager manager = TaskStorage.load(file);
            while (true) {
                System.out.println("\n1 Добавить | 2 Список | 3 Выполнено | 4 Фильтр | 5 Удалить | 0 Выход");
                String command = ask(input, "Команда");
                if (command.equals("0")) return;
                boolean changed = false;
                try {
                    switch (command) {
                        case "1" -> {
                            TaskItem added = manager.add(ask(input, "Название"), ask(input, "Описание"),
                                LocalDate.parse(ask(input, "Дедлайн YYYY-MM-DD")));
                            System.out.println("Добавлено: " + added);
                            changed = true;
                        }
                        case "2" -> manager.all().forEach(System.out::println);
                        case "3" -> {
                            changed = manager.complete(UUID.fromString(ask(input, "UUID")));
                            System.out.println(changed ? "Отмечено" : "Задача не найдена");
                        }
                        case "4" -> {
                            String status = ask(input, "Статус done/todo");
                            if (!status.equals("done") && !status.equals("todo")) throw new IllegalArgumentException("Ожидается done или todo");
                            manager.filter(status.equals("done")).forEach(System.out::println);
                        }
                        case "5" -> {
                            changed = manager.remove(UUID.fromString(ask(input, "UUID")));
                            System.out.println(changed ? "Удалено" : "Задача не найдена");
                        }
                        default -> System.out.println("Неизвестная команда");
                    }
                    if (changed) TaskStorage.save(manager, file);
                } catch (IllegalArgumentException e) { System.out.println("Ошибка: " + e.getMessage()); }
            }
        } catch (IOException e) {
            System.err.println("Ошибка файла задач: " + e.getMessage());
            System.exit(1);
        }
    }
}
