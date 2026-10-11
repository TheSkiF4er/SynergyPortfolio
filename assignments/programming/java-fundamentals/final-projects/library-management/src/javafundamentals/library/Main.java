package javafundamentals.library;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;
import java.util.Scanner;
import java.util.UUID;

/** Консольный интерфейс: каждая успешная операция сохраняется в файл. */
public final class Main {
    private Main() {}

    private static String prompt(Scanner in, String text) {
        System.out.print(text + ": ");
        return in.nextLine().trim();
    }

    private static void show(List<Book> books) {
        if (books.isEmpty()) System.out.println("Книг не найдено");
        else books.forEach(System.out::println);
    }

    public static void main(String[] args) {
        Path file = Path.of(args.length > 0 ? args[0] : "library.tsv");
        try (Scanner in = new Scanner(System.in)) {
            Library library = LibraryStorage.load(file);
            while (true) {
                System.out.println("\n1 Добавить | 2 Список | 3 Удалить | 4 Поиск | 5 Сортировка | 6 Читатель | 7 Выдать | 8 Вернуть | 9 Выдачи | 0 Выход");
                String command = prompt(in, "Команда");
                if (command.equals("0")) return;
                boolean changed = false;
                try {
                    switch (command) {
                        case "1" -> {
                            Book added = library.add(prompt(in, "Название"), prompt(in, "Автор"),
                                Integer.parseInt(prompt(in, "Год")), prompt(in, "Жанр"));
                            System.out.println("Добавлено: " + added);
                            changed = true;
                        }
                        case "2" -> show(library.all());
                        case "3" -> {
                            changed = library.remove(UUID.fromString(prompt(in, "UUID книги")));
                            System.out.println(changed ? "Удалено" : "Книга не найдена");
                        }
                        case "4" -> show(library.search(prompt(in, "Поле title/author/genre"), prompt(in, "Запрос")));
                        case "5" -> show(library.sorted(prompt(in, "Поле title/author/year")));
                        case "6" -> {
                            library.register(prompt(in, "Имя читателя"));
                            changed = true;
                        }
                        case "7" -> {
                            library.borrow(UUID.fromString(prompt(in, "UUID книги")), prompt(in, "Имя читателя"));
                            changed = true;
                        }
                        case "8" -> {
                            library.returnBook(UUID.fromString(prompt(in, "UUID книги")));
                            changed = true;
                        }
                        case "9" -> library.loans().forEach((id, name) -> System.out.println(id + " -> " + name));
                        default -> System.out.println("Неизвестная команда");
                    }
                    if (changed) LibraryStorage.save(library, file);
                } catch (IllegalArgumentException | IllegalStateException e) {
                    System.out.println("Ошибка: " + e.getMessage());
                }
            }
        } catch (IOException e) {
            System.err.println("Ошибка чтения/записи библиотеки: " + e.getMessage());
            System.exit(1);
        }
    }
}
