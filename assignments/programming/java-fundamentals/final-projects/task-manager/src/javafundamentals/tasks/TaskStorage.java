package javafundamentals.tasks;

import java.io.IOException;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import javafundamentals.support.TextStore;

public final class TaskStorage {
    private TaskStorage() {}

    public static void save(TaskManager manager, Path file) throws IOException {
        List<String> lines = new ArrayList<>();
        lines.add("TASKS\t1");
        for (TaskItem task : manager.all()) {
            lines.add(task.id() + "\t" + TextStore.encode(task.title()) + "\t"
                + TextStore.encode(task.description()) + "\t" + task.deadline() + "\t" + task.done());
        }
        TextStore.write(file, lines);
    }

    public static TaskManager load(Path file) throws IOException {
        TaskManager manager = new TaskManager();
        List<String> lines = TextStore.read(file);
        if (lines.isEmpty()) return manager;
        if (!lines.get(0).equals("TASKS\t1")) throw new IOException("Неверный формат файла задач");
        for (int i = 1; i < lines.size(); i++) {
            try {
                String[] row = lines.get(i).split("\\t", -1);
                if (row.length != 5 || (!row[4].equals("true") && !row[4].equals("false"))) {
                    throw new IllegalArgumentException("Количество или значение полей");
                }
                manager.restore(new TaskItem(UUID.fromString(row[0]), TextStore.decode(row[1]),
                    TextStore.decode(row[2]), LocalDate.parse(row[3]), Boolean.parseBoolean(row[4])));
            } catch (RuntimeException e) { throw new IOException("Неверная строка " + (i + 1), e); }
        }
        return manager;
    }
}
