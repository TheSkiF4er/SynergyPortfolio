package javafundamentals.fileio;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.LinkOption;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.Scanner;

/** Тема 9: создание файла, чтение, удаление пробелов и повторное чтение. */
public final class FileEditor {
    private FileEditor() {}

    public record Result(String before, String after, Path path) {}

    public static Result process(Path directory, String filename, String content) throws IOException {
        if (filename == null || filename.isBlank() || filename.equals(".") || filename.equals("..")) {
            throw new IllegalArgumentException("Укажите имя файла");
        }
        // Только имя файла, без абсолютных путей и выхода из рабочей директории.
        Path name = Path.of(filename);
        if (name.isAbsolute() || name.getNameCount() != 1 || filename.contains("/") || filename.contains("\\")) {
            throw new IllegalArgumentException("Укажите имя файла без каталогов");
        }
        Path root = directory.toAbsolutePath().normalize();
        if (!Files.isDirectory(root, LinkOption.NOFOLLOW_LINKS)) throw new IOException("Каталог не найден");
        Path target = root.resolve(filename);
        // CREATE_NEW предотвращает случайную порчу существующего файла.
        Files.writeString(target, content, StandardCharsets.UTF_8, StandardOpenOption.CREATE_NEW, StandardOpenOption.WRITE);
        String before = Files.readString(target, StandardCharsets.UTF_8);
        Files.writeString(target, before.replace(" ", ""), StandardCharsets.UTF_8, StandardOpenOption.TRUNCATE_EXISTING);
        String after = Files.readString(target, StandardCharsets.UTF_8);
        return new Result(before, after, target);
    }

    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            System.out.println("Введите название файла:");
            String filename = input.nextLine();
            System.out.println("Введите текст:");
            String content = input.nextLine();
            Result result = process(Path.of("."), filename, content);
            System.out.println("До удаления пробелов: " + result.before());
            System.out.println("После удаления пробелов: " + result.after());
            System.out.println("Файл: " + result.path());
        } catch (IOException | IllegalArgumentException e) {
            System.err.println("Ошибка обработки файла: " + e.getMessage());
            System.exit(1);
        }
    }
}
