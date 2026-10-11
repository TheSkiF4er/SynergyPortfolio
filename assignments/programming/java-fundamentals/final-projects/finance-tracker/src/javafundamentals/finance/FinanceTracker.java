package javafundamentals.finance;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

/** Приложение хранит доходы (+) и расходы (-) как знаковые транзакции. */
public final class FinanceTracker {
    private final List<Transaction> transactions = new ArrayList<>();

    public Transaction add(BigDecimal amount, String category) {
        Transaction transaction = new Transaction(UUID.randomUUID(), amount, category);
        transactions.add(transaction);
        return transaction;
    }

    void restore(Transaction transaction) {
        if (transactions.stream().anyMatch(item -> item.id().equals(transaction.id()))) {
            throw new IllegalArgumentException("Повторный ID транзакции");
        }
        transactions.add(transaction);
    }

    public boolean remove(UUID id) { return transactions.removeIf(item -> item.id().equals(id)); }
    public List<Transaction> all() { return List.copyOf(transactions); }

    public BigDecimal total() {
        return transactions.stream().map(Transaction::amount).reduce(new BigDecimal("0.00"), BigDecimal::add);
    }

    public List<Transaction> byCategory(String category) {
        if (category == null || category.isBlank()) throw new IllegalArgumentException("Категория обязательна");
        return transactions.stream().filter(item -> item.category().toLowerCase(Locale.ROOT)
            .equals(category.trim().toLowerCase(Locale.ROOT))).toList();
    }
}
