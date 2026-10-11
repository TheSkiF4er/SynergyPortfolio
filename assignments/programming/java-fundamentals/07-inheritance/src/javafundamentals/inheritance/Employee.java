package javafundamentals.inheritance;

/** Базовый тип работника; защищённый конструктор обеспечивает валидацию. */
public class Employee {
    private final String name;
    private final String lastname;
    private final int number;

    public Employee(String name, String lastname, int number) {
        if (name == null || name.isBlank() || lastname == null || lastname.isBlank() || number < 1) {
            throw new IllegalArgumentException("Проверьте ФИО и номер сотрудника");
        }
        this.name = name.trim();
        this.lastname = lastname.trim();
        this.number = number;
    }

    public String getName() { return name; }
    public String getLastname() { return lastname; }
    public int getNumber() { return number; }
}
