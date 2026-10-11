package javafundamentals.tests;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintStream;
import java.math.BigDecimal;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;
import javafundamentals.proxy.ProxyEndpoint;
import javafundamentals.proxy.ProxyScanner;
import javafundamentals.threads.RunnableProxyChecker;
import javafundamentals.threads.ThreadProxyChecker;
import javafundamentals.chat.ChatServer;
import javafundamentals.fileio.FileEditor;
import javafundamentals.inheritance.ProductionWorker;
import javafundamentals.library.Book;
import javafundamentals.library.Library;
import javafundamentals.library.LibraryStorage;
import javafundamentals.finance.FinanceTracker;
import javafundamentals.finance.FinanceStorage;
import javafundamentals.tasks.TaskManager;
import javafundamentals.tasks.TaskStorage;

/** Тесты без JUnit и зависимостей: вся программа собирается одной командой javac. */
public final class CourseTests {
    private static int cases;
    private CourseTests() {}

    private static void ok(boolean condition, String message) {
        cases++;
        if (!condition) throw new AssertionError(message);
    }

    private static void eq(Object actual, Object expected) {
        ok(expected.equals(actual), "Ожидается " + expected + ", получено " + actual);
    }

    private static void fails(Class<? extends Throwable> type, Runnable code) {
        cases++;
        try { code.run(); }
        catch (Throwable failure) {
            if (type.isInstance(failure)) return;
            throw new AssertionError("Неверный тип ошибки: " + failure, failure);
        }
        throw new AssertionError("Ожидалась ошибка " + type.getSimpleName());
    }

    private static void syntax() {
        eq(javafundamentals.syntax.Main.remainder(15, 6), 3);
        eq(javafundamentals.syntax.Main.vector(2, 1, -2, 3), "X=-4 Y=2");
        eq(javafundamentals.syntax.Main.increase15(new BigDecimal("100")), new BigDecimal("115.00"));
        eq(javafundamentals.syntax.Main.calculate(new BigDecimal("8"), new BigDecimal("5"), "+"), new BigDecimal("13"));
        eq(javafundamentals.syntax.Main.calculate(new BigDecimal("8"), new BigDecimal("5"), "-"), new BigDecimal("3"));
        eq(javafundamentals.syntax.Main.calculate(new BigDecimal("8"), new BigDecimal("5"), "*"), new BigDecimal("40"));
        ok(javafundamentals.syntax.Main.calculate(new BigDecimal("7"), new BigDecimal("2"), "/")
            .compareTo(new BigDecimal("3.5")) == 0, "Деление");
        fails(ArithmeticException.class, () -> javafundamentals.syntax.Main.calculate(BigDecimal.ONE, BigDecimal.ZERO, "/"));
        fails(IllegalArgumentException.class, () -> javafundamentals.syntax.Main.calculate(BigDecimal.ONE, BigDecimal.ONE, "^"));
    }

    private static void arrays() {
        eq(javafundamentals.arrays.Main.minimumOdd(new int[]{3400,25,345,234,36,234,5,32,42,342}), 5);
        eq(javafundamentals.arrays.Main.minimumOdd(new int[]{-34,-25,-345,-234,-36,-234,-5,-32,-42,-342}), -345);
        fails(java.util.NoSuchElementException.class, () -> javafundamentals.arrays.Main.minimumOdd(new int[]{2, 4}));
        eq(javafundamentals.arrays.Main.expand(364), "300 60 4");
        eq(javafundamentals.arrays.Main.expand(100), "100 0 0");
        fails(IllegalArgumentException.class, () -> javafundamentals.arrays.Main.expand(99));
        eq(javafundamentals.arrays.Main.triangle(2), "8\n88");
        ok(javafundamentals.arrays.Main.triangle(10).endsWith("8888888888"), "10 строк треугольника");
        List<BigDecimal> deposits = javafundamentals.arrays.Main.forecast(new BigDecimal("10000"), new BigDecimal("10"));
        eq(deposits.size(), 5);
        ok(deposits.get(0).compareTo(new BigDecimal("11000")) == 0, "Год 1");
        ok(deposits.get(4).compareTo(new BigDecimal("16105.1")) == 0, "Год 5");
        eq(javafundamentals.arrays.Main.longestRun(new int[]{2,4,4,4,8,8,4,12,12,14}), 3);
        eq(javafundamentals.arrays.Main.longestRun(new int[0]), 0);
        eq(javafundamentals.arrays.Main.longestRun(new int[]{1}), 1);
    }

    private static void oop() {
        var base = new javafundamentals.oopbasics.Card("Банк", "Мир", "0123", "04/29", "001", "дебетовая", true);
        ok(base.formatCardInfo().contains("CVV: 001"), "Тема 4 выводит учебный CVV");
        var methods = new javafundamentals.oopmethods.Card("Банк", "Мир", "0123", "04/29", "001", "дебетовая", true);
        ok(methods.pay(500), "Первый платёж");
        ok(methods.pay(500), "Второй платёж");
        ok(!methods.pay(500), "Третий платёж отклонён");
        ok(!methods.pay(-1), "Отрицательная сумма отклонена");
        eq(methods.getBalance(), 0.0);
        var encaps = new javafundamentals.encapsulation.Card("Банк", "Мир", "00001234", "04/29", "001", "дебетовая", true);
        eq(encaps.getMaskedNumber(), "****1234");
        double initial = encaps.getBalance();
        encaps.setBalance(-10);
        eq(encaps.getBalance(), initial);
        encaps.setBalance(1500);
        eq(encaps.getBalance(), 1500.0);
        encaps.setPin("123");
        ok(encaps.verifyPin("0000"), "Неправильный PIN не принят");
        encaps.setPin("0123");
        ok(encaps.verifyPin("0123"), "Ведущий ноль PIN сохранён");
        ok(!encaps.getCardInfo().contains("001"), "CVV не выводится");
        var worker = new ProductionWorker("Иван", "Иванов", 100, 2, 300.50);
        eq(worker.getName(), "Иван");
        eq(worker.getLastname(), "Иванов");
        eq(worker.getNumber(), 100);
        eq(worker.getShiftNumber(), 2);
        eq(worker.getPayment(), 300.50);
        fails(IllegalArgumentException.class, () -> new ProductionWorker("", "Иванов", 1, 2, 3));
        fails(IllegalArgumentException.class, () -> new ProductionWorker("Иван", "Иванов", 1, 0, 3));
    }

    private static void exceptionsAndFiles(Path root) throws IOException {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        try (PrintStream output = new PrintStream(buffer, true, StandardCharsets.UTF_8)) {
            javafundamentals.exceptions.Main.divideArray(new int[]{2, 0, 4}, output);
        }
        String text = buffer.toString(StandardCharsets.UTF_8);
        ok(text.startsWith("0\n"), "Деление i на первый элемент");
        ok(text.contains("Деление на ноль запрещено"), "Арифметическое исключение");
        ok(text.endsWith("Программа успешно завершена\n"), "Выход за границу обработан");
        FileEditor.Result result = FileEditor.process(root, "test.txt", "Привет, мир!  123");
        eq(result.before(), "Привет, мир!  123");
        eq(result.after(), "Привет,мир!123");
        eq(Files.readString(root.resolve("test.txt")), "Привет,мир!123");
        fails(IllegalArgumentException.class, () -> { try { FileEditor.process(root, "../escape", "bad"); } catch (IOException e) { throw new IllegalStateException(e); } });
        boolean existsPrevented = false;
        try { FileEditor.process(root, "test.txt", "overwrite"); }
        catch (java.nio.file.FileAlreadyExistsException e) { existsPrevented = true; }
        ok(existsPrevented, "Повторная запись не должна уничтожать существующий файл");
    }

    private static void proxies(Path root) throws Exception {
        fails(IllegalArgumentException.class, () -> ProxyEndpoint.parse("999.0.0.1:42"));
        fails(IllegalArgumentException.class, () -> ProxyEndpoint.parse("127.0.0.1:0"));
        fails(IllegalArgumentException.class, () -> ProxyEndpoint.parse("hello:80"));
        try (ServerSocket server = new ServerSocket(0)) {
            ProxyEndpoint live = new ProxyEndpoint("127.0.0.1", server.getLocalPort());
            ProxyEndpoint bad = new ProxyEndpoint("127.0.0.1", 1);
            ok(ProxyScanner.reachable(live, 500), "Локальный открытый TCP-порт");
            List<ProxyEndpoint> inputs = List.of(bad, live);
            eq(ProxyScanner.scan(inputs, 500), List.of(live));
            eq(RunnableProxyChecker.scan(inputs, 500, 2), List.of(live));
            eq(ThreadProxyChecker.scan(inputs, 500, 2), List.of(live));
            Path input = root.resolve("proxies.txt");
            Files.writeString(input, "# проверка\n" + live + "\n" + live + "\n\n");
            eq(ProxyScanner.load(input), List.of(live));
            Path output = root.resolve("good_ip.txt");
            ProxyScanner.save(output, List.of(live));
            eq(Files.readString(output).trim(), live.toString());
            Files.writeString(input, "bad-data\n");
            boolean rejected = false;
            try { ProxyScanner.load(input); } catch (IOException e) { rejected = true; }
            ok(rejected, "Неправильный файл прокси отклонён");
        }
    }

    private static void chat() throws Exception {
        try (ChatServer server = new ChatServer(0)) {
            AtomicReference<Throwable> failure = new AtomicReference<>();
            Thread thread = new Thread(() -> {
                try { server.serve(); }
                catch (Throwable e) { failure.set(e); }
            }, "test-chat-server");
            thread.setDaemon(true);
            thread.start();
            try (Socket first = new Socket("127.0.0.1", server.getPort());
                 Socket second = new Socket("127.0.0.1", server.getPort())) {
                first.setSoTimeout(3000);
                second.setSoTimeout(3000);
                BufferedReader alice = new BufferedReader(new InputStreamReader(first.getInputStream(), StandardCharsets.UTF_8));
                BufferedReader bob = new BufferedReader(new InputStreamReader(second.getInputStream(), StandardCharsets.UTF_8));
                var aliceOutput = new OutputStreamWriter(first.getOutputStream(), StandardCharsets.UTF_8);
                var bobOutput = new OutputStreamWriter(second.getOutputStream(), StandardCharsets.UTF_8);
                eq(alice.readLine(), "Введите имя:");
                eq(bob.readLine(), "Введите имя:");
                aliceOutput.write("Алиса\n"); aliceOutput.flush();
                bobOutput.write("Боб\n"); bobOutput.flush();
                eq(alice.readLine(), "Вы вошли как Алиса");
                eq(bob.readLine(), "Вы вошли как Боб");
                aliceOutput.write("Привет!\n"); aliceOutput.flush();
                eq(bob.readLine(), "Алиса: Привет!");
                aliceOutput.write("/quit\n"); aliceOutput.flush();
                bobOutput.write("/quit\n"); bobOutput.flush();
            }
            server.close();
            thread.join(2000);
            ok(failure.get() == null, "Сервер остановился без ошибки: " + failure.get());
            ok(!thread.isAlive(), "Сервер завершён");
        }
    }

    private static void library(Path root) throws Exception {
        Library library = new Library();
        fails(IllegalArgumentException.class, () -> library.add("", "автор", 2024, "жанр"));
        fails(IllegalArgumentException.class, () -> library.add("книга", "автор", -1, "жанр"));
        Book older = library.add("Б", "Автор Б", 1990, "История");
        Book newer = library.add("А", "Автор А", 2024, "Роман");
        eq(library.all().size(), 2);
        eq(library.search("title", "а").size(), 1);
        eq(library.search("genre", "ИСТОР").get(0).id(), older.id());
        eq(library.sorted("title").get(0).id(), newer.id());
        eq(library.sorted("year").get(0).id(), older.id());
        library.register("Читатель");
        library.borrow(older.id(), "Читатель");
        fails(IllegalStateException.class, () -> library.remove(older.id()));
        fails(IllegalStateException.class, () -> library.borrow(older.id(), "Читатель"));
        Path file = root.resolve("library.tsv");
        LibraryStorage.save(library, file);
        Library loaded = LibraryStorage.load(file);
        eq(loaded.all().size(), 2);
        eq(loaded.loans().get(older.id()), "Читатель");
        loaded.returnBook(older.id());
        ok(loaded.remove(older.id()), "Книга удалена после возврата");
        LibraryStorage.save(loaded, file);
        eq(LibraryStorage.load(file).all().size(), 1);
        Files.writeString(file, "corrupted");
        boolean failed = false;
        try { LibraryStorage.load(file); } catch (IOException e) { failed = true; }
        ok(failed, "Повреждённые данные обнаружены");
    }

    private static void finance(Path root) throws Exception {
        FinanceTracker tracker = new FinanceTracker();
        var plus = tracker.add(new BigDecimal("250.10"), "Зарплата");
        var minus = tracker.add(new BigDecimal("-50.05"), "покупка");
        eq(tracker.total(), new BigDecimal("200.05"));
        eq(tracker.byCategory("ПОКУПКА").size(), 1);
        fails(IllegalArgumentException.class, () -> tracker.add(new BigDecimal("1.123"), "Тест"));
        fails(IllegalArgumentException.class, () -> tracker.add(BigDecimal.ONE, ""));
        Path file = root.resolve("finance.tsv");
        FinanceStorage.save(tracker, file);
        FinanceTracker restored = FinanceStorage.load(file);
        eq(restored.total(), new BigDecimal("200.05"));
        ok(restored.remove(minus.id()), "Удаление расхода");
        eq(restored.total(), new BigDecimal("250.10"));
        FinanceStorage.save(restored, file);
        eq(FinanceStorage.load(file).all().get(0).id(), plus.id());
    }

    private static void tasks(Path root) throws Exception {
        TaskManager manager = new TaskManager();
        var a = manager.add("Учёба", "Выполнить ДЗ", LocalDate.of(2026, 10, 12));
        var b = manager.add("Спорт", "Тренировка", LocalDate.of(2026, 10, 13));
        eq(manager.all().size(), 2);
        eq(manager.filter(false).size(), 2);
        ok(manager.complete(a.id()), "Отметка выполнена");
        eq(manager.filter(true).size(), 1);
        ok(!manager.complete(UUID.randomUUID()), "Неизвестный ID не меняет список");
        Path file = root.resolve("tasks.tsv");
        TaskStorage.save(manager, file);
        TaskManager restored = TaskStorage.load(file);
        eq(restored.filter(true).get(0).title(), "Учёба");
        eq(restored.filter(false).get(0).id(), b.id());
        ok(restored.remove(a.id()), "Удаление");
        TaskStorage.save(restored, file);
        eq(TaskStorage.load(file).all().size(), 1);
        fails(IllegalArgumentException.class, () -> manager.add("", "descr", LocalDate.now()));
    }

    public static void main(String[] args) throws Exception {
        ok(Runtime.version().feature() >= 21, "JDK 21+");
        syntax();
        arrays();
        oop();
        Path root = Files.createTempDirectory("java-course-tests-");
        try {
            exceptionsAndFiles(root);
            proxies(root);
            chat();
            library(root);
            finance(root);
            tasks(root);
        } finally {
            try (var files = Files.walk(root)) {
                files.sorted(java.util.Comparator.reverseOrder()).forEach(path -> {
                    try { Files.deleteIfExists(path); } catch (IOException e) { throw new IllegalStateException(e); }
                });
            }
        }
        System.out.println("Java Fundamentals: " + cases + " проверок успешно пройдено");
    }
}
