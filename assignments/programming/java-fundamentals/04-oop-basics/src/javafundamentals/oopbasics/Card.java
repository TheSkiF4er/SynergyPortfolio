package javafundamentals.oopbasics;

/** Учебная модель карты: исключительно вымышленные реквизиты, не для настоящих платежей. */
public class Card {
    /** String: название банка содержит буквы и пробелы. */
    private final String bank;
    /** String: название платёжной системы — текст. */
    private final String paymentSystem;
    /** String: номер карты — идентификатор, у которого возможны ведущие нули. */
    private final String number;
    /** String: срок действия MM/YY, а не дата конкретного дня. */
    private final String expiry;
    /** String: CVV может содержать ведущие нули; храним только учебный пример. */
    private final String cvv;
    /** String: описание типа карты для отображения. */
    private final String type;
    /** boolean: технология NFC либо поддерживается, либо нет. */
    private final boolean nfc;

    public Card(String bank, String paymentSystem, String number, String expiry, String cvv, String type, boolean nfc) {
        this.bank = requireText(bank);
        this.paymentSystem = requireText(paymentSystem);
        this.number = requireText(number);
        this.expiry = requireText(expiry);
        this.cvv = requireText(cvv);
        this.type = requireText(type);
        this.nfc = nfc;
    }

    private static String requireText(String value) {
        if (value == null || value.isBlank()) throw new IllegalArgumentException("Поле не может быть пустым");
        return value.trim();
    }

    public String formatCardInfo() {
        return "Наименование банка: " + bank + "\nПлатежная система: " + paymentSystem
            + "\nНомер карты: " + number + "\nСрок действия: " + expiry + "\nCVV: " + cvv
            + "\nТип карты: " + type + "\nПоддержка NFC: " + (nfc ? "Да" : "Нет");
    }

    /** В соответствии с условием метод сам выводит информацию в консоль. */
    public void getCardInfo() { System.out.println(formatCardInfo()); }

    public static void main(String[] args) {
        Card card = new Card("Сбер", "Мир", "2202205075178415", "04/29", "547", "кредитная", true);
        card.getCardInfo();
    }
}
