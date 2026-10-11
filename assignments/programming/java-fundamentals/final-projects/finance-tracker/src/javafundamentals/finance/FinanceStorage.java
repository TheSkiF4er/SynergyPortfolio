package javafundamentals.finance;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import javafundamentals.support.TextStore;

public final class FinanceStorage {
    private FinanceStorage() {}

    public static void save(FinanceTracker tracker, Path file) throws IOException {
        List<String> lines = new ArrayList<>();
        lines.add("FINANCE\t1");
        for (Transaction transaction : tracker.all()) {
            lines.add(transaction.id() + "\t" + transaction.amount().toPlainString() + "\t"
                + TextStore.encode(transaction.category()));
        }
        TextStore.write(file, lines);
    }

    public static FinanceTracker load(Path file) throws IOException {
        List<String> lines = TextStore.read(file);
        FinanceTracker tracker = new FinanceTracker();
        if (lines.isEmpty()) return tracker;
        if (!lines.get(0).equals("FINANCE\t1")) throw new IOException("Неверный формат файла финансов");
        for (int i = 1; i < lines.size(); i++) {
            try {
                String[] row = lines.get(i).split("\\t", -1);
                if (row.length != 3) throw new IllegalArgumentException("Количество полей");
                tracker.restore(new Transaction(UUID.fromString(row[0]), new BigDecimal(row[1]), TextStore.decode(row[2])));
            } catch (RuntimeException e) { throw new IOException("Неверная строка " + (i + 1), e); }
        }
        return tracker;
    }
}
