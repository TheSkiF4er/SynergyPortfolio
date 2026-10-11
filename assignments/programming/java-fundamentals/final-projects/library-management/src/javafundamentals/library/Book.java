package javafundamentals.library;

import java.util.UUID;

/** Неизменяемая книга с уникальным ID: одноимённые книги допустимы. */
public record Book(UUID id, String title, String author, int year, String genre) {
    public Book {
        if (id == null) throw new IllegalArgumentException("ID книги обязателен");
        title = required(title, "Название");
        author = required(author, "Автор");
        genre = required(genre, "Жанр");
        if (year < 0) throw new IllegalArgumentException("Год не может быть отрицательным");
    }

    private static String required(String value, String label) {
        if (value == null || value.isBlank()) throw new IllegalArgumentException(label + " не может быть пустым");
        return value.trim();
    }

    @Override public String toString() {
        return id + " | " + title + " | " + author + " | " + year + " | " + genre;
    }
}
