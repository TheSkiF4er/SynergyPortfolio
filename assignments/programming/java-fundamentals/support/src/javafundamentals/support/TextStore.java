package javafundamentals.support;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.AtomicMoveNotSupportedException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Base64;
import java.util.List;

/** Общий безопасный файловый слой: UTF-8, кодирование полей и атомарная замена. */
public final class TextStore {
    private TextStore() {}

    /** Base64 исключает переносы строк и табуляции из сериализованных полей. */
    public static String encode(String value) {
        return Base64.getEncoder().encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }

    public static String decode(String value) {
        return new String(Base64.getDecoder().decode(value), StandardCharsets.UTF_8);
    }

    public static List<String> read(Path path) throws IOException {
        if (!Files.exists(path)) return List.of();
        return Files.readAllLines(path, StandardCharsets.UTF_8);
    }

    public static void write(Path path, List<String> lines) throws IOException {
        Path absolute = path.toAbsolutePath().normalize();
        Path parent = absolute.getParent();
        if (parent == null) throw new IOException("Для хранилища необходим родительский каталог");
        Files.createDirectories(parent);
        // Временный файл размещён рядом с целевым, чтобы rename был атомарным,
        // когда это поддерживается файловой системой.
        Path temporary = Files.createTempFile(parent, ".portfolio-", ".tmp");
        try {
            Files.write(temporary, lines, StandardCharsets.UTF_8);
            try {
                Files.move(temporary, absolute, StandardCopyOption.ATOMIC_MOVE, StandardCopyOption.REPLACE_EXISTING);
            } catch (AtomicMoveNotSupportedException e) {
                Files.move(temporary, absolute, StandardCopyOption.REPLACE_EXISTING);
            }
        } finally {
            Files.deleteIfExists(temporary);
        }
    }
}
