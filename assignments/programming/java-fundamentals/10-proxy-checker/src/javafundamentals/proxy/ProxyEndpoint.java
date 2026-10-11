package javafundamentals.proxy;

/** Для курса допускаются только IPv4:порт; это не сетевой сканер диапазонов. */
public record ProxyEndpoint(String ip, int port) {
    public ProxyEndpoint {
        if (ip == null || !ip.matches("[0-9]+(\\.[0-9]+){3}") || port < 1 || port > 65535) {
            throw new IllegalArgumentException("Адрес должен быть IPv4:порт (1-65535)");
        }
        String[] pieces = ip.split("\\.");
        for (String piece : pieces) {
            if (piece.length() > 3 || Integer.parseInt(piece) > 255) {
                throw new IllegalArgumentException("Неверный IPv4 адрес: " + ip);
            }
        }
    }

    public static ProxyEndpoint parse(String line) {
        if (line == null) throw new IllegalArgumentException("Адрес отсутствует");
        int sep = line.lastIndexOf(':');
        if (sep <= 0 || sep == line.length() - 1) throw new IllegalArgumentException("Ожидается IPv4:порт");
        try {
            return new ProxyEndpoint(line.substring(0, sep).trim(), Integer.parseInt(line.substring(sep + 1).trim()));
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Неверный порт: " + line, e);
        }
    }

    @Override public String toString() { return ip + ":" + port; }
}
