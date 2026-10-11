package javafundamentals.inheritance;

/** Производственный работник расширяет общие характеристики Employee. */
public final class ProductionWorker extends Employee {
    private final int shiftNumber;
    private final double payment;

    public ProductionWorker(String name, String lastname, int number, int shiftNumber, double payment) {
        super(name, lastname, number);
        if (shiftNumber < 1 || !Double.isFinite(payment) || payment < 0) {
            throw new IllegalArgumentException("Смена должна быть положительной, ставка неотрицательной");
        }
        this.shiftNumber = shiftNumber;
        this.payment = payment;
    }

    public int getShiftNumber() { return shiftNumber; }
    public double getPayment() { return payment; }
}
