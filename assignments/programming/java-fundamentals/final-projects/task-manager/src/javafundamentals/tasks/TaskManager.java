package javafundamentals.tasks;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/** CRUD/фильтрация независимо от консоли и записи на диск. */
public final class TaskManager {
    private final List<TaskItem> tasks = new ArrayList<>();

    public TaskItem add(String title, String description, LocalDate deadline) {
        TaskItem task = new TaskItem(UUID.randomUUID(), title, description, deadline, false);
        tasks.add(task);
        return task;
    }

    void restore(TaskItem task) {
        if (tasks.stream().anyMatch(item -> item.id().equals(task.id()))) throw new IllegalArgumentException("Повторный ID задачи");
        tasks.add(task);
    }

    public boolean complete(UUID id) {
        for (int i = 0; i < tasks.size(); i++) {
            TaskItem task = tasks.get(i);
            if (task.id().equals(id)) {
                tasks.set(i, task.completed());
                return true;
            }
        }
        return false;
    }

    public boolean remove(UUID id) { return tasks.removeIf(item -> item.id().equals(id)); }
    public List<TaskItem> all() { return List.copyOf(tasks); }
    public List<TaskItem> filter(boolean completed) { return tasks.stream().filter(item -> item.done() == completed).toList(); }
}
