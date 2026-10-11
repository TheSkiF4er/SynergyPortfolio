package javafundamentals.encapsulation;

/**
 * Инкапсуляция учебной карты. Для неизменяемых реквизитов доступны только
 * геттеры; номер показывается маскированным, CVV никогда не возвращается.
 * Баланс доступен для чтения и изменения с проверкой. PIN можно менять,
 * но не читать, чтобы он не раскрывался через API. Реальные реквизиты и PIN
 * нельзя хранить подобным образом: это исключительно упражнение ООП.
 */
public class Card {
    private final String bank;
    private final String paymentSystem;
    private final String number;
    private final String expiry;
    private final String cvv;
    private final String type;
    private final boolean nfc;
    private double balance = 1000.00;
    private String pin = "0000";

    public Card(String bank, String paymentSystem, String number, String expiry, String cvv, String type, boolean nfc) {
        this.bank = require(bank);
        this.paymentSystem = require(paymentSystem);
        this.number = require(number);
        this.expiry = require(expiry);
        this.cvv = require(cvv);
        this.type = require(type);
        this.nfc = nfc;
    }

    private static String require(String s) {
        if (s == null || s.isBlank()) throw new IllegalArgumentException("Реквизит обязателен");
        return s.trim();
    }

    public String getBank() { return bank; }
    public String getPaymentSystem() { return paymentSystem; }
    public String getMaskedNumber() {
        return "****" + number.substring(Math.max(0, number.length() - 4));
    }
    public String getExpiry() { return expiry; }
    public String getType() { return type; }
    public boolean isNfc() { return nfc; }
    public double getBalance() { return balance; }

    public boolean pay(double amount) {
        if (!Double.isFinite(amount) || amount <= 0 || amount > balance) return false;
        balance -= amount;
        return true;
    }

    /** Баланс ниже нуля отклоняется; рост баланса сопровождается уведомлением. */
    public void setBalance(double value) {
        if (!Double.isFinite(value) || value < 0) {
            System.out.println("Недостаточно средств");
            return;
        }
        boolean added = value > balance;
        balance = value;
        if (added) System.out.println("Баланс успешно пополнен: " + balance);
    }

    /** PIN остаётся String: допустимы ведущие нули. */
    public void setPin(String value) {
        if (value == null || !value.matches("[0-9]{4}")) {
            System.out.println("Некорректный пин код");
            return;
        }
        pin = value;
        System.out.println("Пин код успешно изменен");
    }

    public boolean verifyPin(String entered) { return pin.equals(entered); }

    public String getCardInfo() {
        return getBank() + " / " + getPaymentSystem() + " / " + getMaskedNumber() + " / " + getExpiry()
            + " / " + getType() + " / NFC: " + isNfc() + " / " + getBalance();
    }

    public static void main(String[] args) {
        Card card = new Card("Сбер", "Мир", "2202205075178415", "04/29", "547", "дебетовая", true);
        card.setPin("1234");
        card.setPin("12");
        card.setBalance(1500);
        card.setBalance(-1);
        System.out.println(card.getCardInfo());
    }
}
