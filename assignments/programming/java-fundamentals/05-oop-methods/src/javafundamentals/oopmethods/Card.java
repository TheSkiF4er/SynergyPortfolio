package javafundamentals.oopmethods;

/** Продолжение темы 4: отдельная версия Card, чтобы видеть эволюцию ООП. */
public class Card {
    private final String bank;
    private final String paymentSystem;
    private final String number;
    private final String expiry;
    private final String cvv;
    private final String type;
    private final boolean nfc;
    private double balance = 1000.00;

    public Card(String bank, String paymentSystem, String number, String expiry, String cvv, String type, boolean nfc) {
        this.bank = bank;
        this.paymentSystem = paymentSystem;
        this.number = number;
        this.expiry = expiry;
        this.cvv = cvv;
        this.type = type;
        this.nfc = nfc;
    }

    /** Не допускаем нулевых/отрицательных списаний и NaN/Infinity. */
    public boolean pay(double summ) {
        if (!Double.isFinite(summ) || summ <= 0 || balance < summ) return false;
        balance -= summ;
        return true;
    }

    /** Сохраняем метод из предыдущего задания. Все реквизиты демонстрационные. */
    public void getCardInfo() {
        System.out.printf("Банк: %s%nСистема: %s%nНомер: %s%nСрок: %s%nCVV: %s%nТип: %s%nNFC: %s%nБаланс: %.2f%n",
            bank, paymentSystem, number, expiry, cvv, type, nfc ? "Да" : "Нет", balance);
    }

    public double getBalance() { return balance; }

    public static void main(String[] args) {
        Card card = new Card("Сбер", "Мир", "2202205075178415", "04/29", "547", "кредитная", true);
        for (int i = 0; i < 3; i++) System.out.println(card.pay(500));
    }
}
