package javafundamentals.library;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

/** Управление коллекцией отдельно от хранения и консольного интерфейса. */
public final class Library {
    private final Map<UUID, Book> books = new LinkedHashMap<>();
    private final Set<String> users = new LinkedHashSet<>();
    private final Map<UUID, String> loans = new LinkedHashMap<>();

    public Book add(String title, String author, int year, String genre) {
        Book book = new Book(UUID.randomUUID(), title, author, year, genre);
        books.put(book.id(), book);
        return book;
    }

    void restoreBook(Book book) {
        if (books.putIfAbsent(book.id(), book) != null) throw new IllegalArgumentException("Повторный ID книги");
    }

    public boolean remove(UUID id) {
        if (loans.containsKey(id)) throw new IllegalStateException("Книга выдана: сначала оформите возврат");
        return books.remove(id) != null;
    }

    public List<Book> all() { return List.copyOf(books.values()); }

    public List<Book> search(String field, String query) {
        if (query == null || query.isBlank()) throw new IllegalArgumentException("Пустой запрос поиска");
        String needle = query.toLowerCase(Locale.ROOT);
        return books.values().stream().filter(book -> {
            String value = switch (field.toLowerCase(Locale.ROOT)) {
                case "title" -> book.title();
                case "author" -> book.author();
                case "genre" -> book.genre();
                default -> throw new IllegalArgumentException("Поле поиска: title, author или genre");
            };
            return value.toLowerCase(Locale.ROOT).contains(needle);
        }).toList();
    }

    public List<Book> sorted(String field) {
        Comparator<Book> comparator = switch (field.toLowerCase(Locale.ROOT)) {
            case "title" -> Comparator.comparing(Book::title, String.CASE_INSENSITIVE_ORDER);
            case "author" -> Comparator.comparing(Book::author, String.CASE_INSENSITIVE_ORDER);
            case "year" -> Comparator.comparingInt(Book::year);
            default -> throw new IllegalArgumentException("Сортировка: title, author, year");
        };
        return books.values().stream().sorted(comparator.thenComparing(Book::id)).toList();
    }

    public void register(String name) {
        if (name == null || name.isBlank()) throw new IllegalArgumentException("Имя читателя не может быть пустым");
        if (!users.add(name.trim())) throw new IllegalArgumentException("Читатель уже зарегистрирован");
    }

    public Set<String> users() { return Set.copyOf(users); }
    public Map<UUID, String> loans() { return Map.copyOf(loans); }

    public void borrow(UUID bookId, String username) {
        if (!books.containsKey(bookId)) throw new IllegalArgumentException("Книга не найдена");
        if (!users.contains(username)) throw new IllegalArgumentException("Читатель не зарегистрирован");
        if (loans.putIfAbsent(bookId, username) != null) throw new IllegalStateException("Книга уже выдана");
    }

    public void returnBook(UUID bookId) {
        if (loans.remove(bookId) == null) throw new IllegalArgumentException("Книга не выдавалась");
    }

    void restoreLoan(UUID bookId, String username) { borrow(bookId, username); }
}
