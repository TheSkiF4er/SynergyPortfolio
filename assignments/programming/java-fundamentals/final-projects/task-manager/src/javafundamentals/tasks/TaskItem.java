package javafundamentals.tasks;

import java.time.LocalDate;
import java.util.UUID;

/** Неизменяемая запись: изменение статуса создаёт копию. */
public record TaskItem(UUID id, String title, String description, LocalDate deadline, boolean done) {
    public TaskItem {
        if (id == null || title == null || title.isBlank() || description == null || description.isBlank() || deadline == null) {
            throw new IllegalArgumentException("Название, описание и срок обязательны");
        }
        title = title.trim();
        description = description.trim();
    }

    public TaskItem completed() { return new TaskItem(id, title, description, deadline, true); }

    @Override public String toString() {
        return id + " | " + (done ? "[x]" : "[ ]") + " | " + deadline + " | " + title + " | " + description;
    }
}
