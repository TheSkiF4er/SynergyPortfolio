package javafundamentals.proxy;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import javafundamentals.support.TextStore;

/**
 * Проверка только TCP-подключения (доступности порта). Подтверждение работы
 * HTTP/SOCKS-прокси потребовало бы протокольной проверки. Не выполняйте
 * сканирование чужих адресов без разрешения владельца.
 */
public final class ProxyScanner {
    private ProxyScanner() {}

    public static boolean reachable(ProxyEndpoint endpoint, int timeoutMs) {
        if (timeoutMs < 1 || timeoutMs > 30_000) throw new IllegalArgumentException("Таймаут 1..30000 мс");
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(endpoint.ip(), endpoint.port()), timeoutMs);
            return true;
        } catch (IOException | SecurityException e) {
            return false;
        }
    }

    public static List<ProxyEndpoint> load(Path file) throws IOException {
        Set<ProxyEndpoint> values = new LinkedHashSet<>();
        int lineNumber = 0;
        for (String line : TextStore.read(file)) {
            lineNumber++;
            String trimmed = line.trim();
            if (trimmed.isEmpty() || trimmed.startsWith("#")) continue;
            try { values.add(ProxyEndpoint.parse(trimmed)); }
            catch (IllegalArgumentException e) { throw new IOException("Строка " + lineNumber + ": " + e.getMessage(), e); }
        }
        return List.copyOf(values);
    }

    public static List<ProxyEndpoint> scan(List<ProxyEndpoint> endpoints, int timeoutMs) {
        List<ProxyEndpoint> good = new ArrayList<>();
        for (ProxyEndpoint endpoint : endpoints) if (reachable(endpoint, timeoutMs)) good.add(endpoint);
        return good;
    }

    public static void save(Path path, List<ProxyEndpoint> endpoints) throws IOException {
        TextStore.write(path, endpoints.stream().map(ProxyEndpoint::toString).toList());
    }

    public static void main(String[] args) {
        try {
            Path source = Path.of(args.length > 0 ? args[0] : "proxies.txt");
            Path target = Path.of(args.length > 1 ? args[1] : "good_ip.txt");
            int timeout = args.length > 2 ? Integer.parseInt(args[2]) : 750;
            List<ProxyEndpoint> good = scan(load(source), timeout);
            save(target, good);
            System.out.printf("Доступно TCP-портов: %d; файл: %s%n", good.size(), target);
        } catch (IOException | IllegalArgumentException e) {
            System.err.println("Ошибка ProxyChecker: " + e.getMessage());
            System.exit(1);
        }
    }
}
