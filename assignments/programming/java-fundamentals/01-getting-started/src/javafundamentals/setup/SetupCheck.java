package javafundamentals.setup;

/** Проверка JDK для первой темы; установку GUI-IDE подтверждает сам студент. */
public final class SetupCheck {
    private SetupCheck() {}

    public static void main(String[] args) {
        System.out.println("Java: " + System.getProperty("java.version"));
        System.out.println("JVM: " + System.getProperty("java.vm.name"));
        System.out.println("ОС: " + System.getProperty("os.name"));
        if (Runtime.version().feature() < 21) {
            throw new IllegalStateException("Для курса требуется JDK 21 или новее");
        }
        System.out.println("Проверка Java Runtime: OK. Настройку IntelliJ IDEA проверьте по README.");
    }
}
