package javafundamentals.library;

import java.io.IOException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import javafundamentals.support.TextStore;

/** Формат TSV v1; текстовые поля кодируются Base64 для безопасного round-trip. */
public final class LibraryStorage {
    private LibraryStorage() {}

    public static void save(Library library, Path path) throws IOException {
        List<String> lines = new ArrayList<>();
        lines.add("LIBRARY\t1");
        for (Book book : library.all()) {
            lines.add("BOOK\t" + book.id() + "\t" + TextStore.encode(book.title()) + "\t"
                + TextStore.encode(book.author()) + "\t" + book.year() + "\t" + TextStore.encode(book.genre()));
        }
        for (String user : library.users()) lines.add("USER\t" + TextStore.encode(user));
        for (var entry : library.loans().entrySet()) {
            lines.add("LOAN\t" + entry.getKey() + "\t" + TextStore.encode(entry.getValue()));
        }
        TextStore.write(path, lines);
    }

    public static Library load(Path path) throws IOException {
        List<String> lines = TextStore.read(path);
        Library library = new Library();
        if (lines.isEmpty()) return library;
        if (!lines.get(0).equals("LIBRARY\t1")) throw new IOException("Неподдерживаемый формат библиотеки");
        List<String[]> loanRows = new ArrayList<>();
        for (int i = 1; i < lines.size(); i++) {
            String[] fields = lines.get(i).split("\\t", -1);
            try {
                switch (fields[0]) {
                    case "BOOK" -> {
                        if (fields.length != 6) throw new IllegalArgumentException("Поля BOOK");
                        library.restoreBook(new Book(UUID.fromString(fields[1]), TextStore.decode(fields[2]),
                            TextStore.decode(fields[3]), Integer.parseInt(fields[4]), TextStore.decode(fields[5])));
                    }
                    case "USER" -> {
                        if (fields.length != 2) throw new IllegalArgumentException("Поля USER");
                        library.register(TextStore.decode(fields[1]));
                    }
                    case "LOAN" -> {
                        if (fields.length != 3) throw new IllegalArgumentException("Поля LOAN");
                        loanRows.add(fields);
                    }
                    default -> throw new IllegalArgumentException("Неизвестный тип записи");
                }
            } catch (RuntimeException e) { throw new IOException("Неверная строка " + (i + 1), e); }
        }
        // Восстанавливаем связи после загрузки книг и читателей; порядок строк не важен.
        for (String[] loan : loanRows) {
            try { library.restoreLoan(UUID.fromString(loan[1]), TextStore.decode(loan[2])); }
            catch (RuntimeException e) { throw new IOException("Некорректная выдача книги", e); }
        }
        return library;
    }
}
