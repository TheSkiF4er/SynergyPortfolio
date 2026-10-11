package javafundamentals.finance;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.UUID;

/** Деньги — BigDecimal, не double: точная сумма без двоичной погрешности. */
public record Transaction(UUID id, BigDecimal amount, String category) {
    public Transaction {
        if (id == null || amount == null || category == null || category.isBlank()) {
            throw new IllegalArgumentException("Все поля транзакции обязательны");
        }
        try { amount = amount.setScale(2, RoundingMode.UNNECESSARY); }
        catch (ArithmeticException e) { throw new IllegalArgumentException("Допускается не больше двух знаков после запятой"); }
        category = category.trim();
    }

    @Override public String toString() { return id + " | " + amount.toPlainString() + " | " + category; }
}
