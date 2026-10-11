package javafundamentals.chat;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketException;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/** Учебный TCP-чат с UTF-8, несколькими клиентами и сообщениями Имя: текст. */
public final class ChatServer implements AutoCloseable {
    private final ServerSocket server;
    private final ExecutorService executor = Executors.newFixedThreadPool(32);
    private final Set<User> clients = ConcurrentHashMap.newKeySet();
    private volatile boolean closed;

    public ChatServer(int port) throws IOException {
        if (port < 0 || port > 65535) throw new IllegalArgumentException("Неверный порт");
        server = new ServerSocket(port);
    }

    public int getPort() { return server.getLocalPort(); }

    public void serve() throws IOException {
        while (!closed) {
            try {
                Socket socket = server.accept();
                socket.setSoTimeout(120_000);
                executor.execute(() -> handle(socket));
            } catch (SocketException e) {
                if (!closed) throw e;
                return;
            }
        }
    }

    private void handle(Socket socket) {
        try (User user = new User(socket)) {
            user.send("Введите имя:");
            String candidate = user.getInput().readLine();
            if (candidate == null) return;
            try { user.setName(candidate.trim()); }
            catch (IllegalArgumentException e) { user.send("Ошибка: " + e.getMessage()); return; }
            clients.add(user);
            user.send("Вы вошли как " + user.getName());
            String message;
            while (!closed && (message = user.getInput().readLine()) != null) {
                if (message.equals("/quit")) break;
                // Не позволяем вводить управляющие последовательности и огромные сообщения.
                if (message.isBlank() || message.length() > 2000) continue;
                broadcast(user.getName() + ": " + message.replaceAll("[\\p{Cntrl}&&[^\\t]]", ""));
            }
        } catch (IOException ignored) {
            // Отключение отдельного клиента не влияет на остальной сервер.
        } finally {
            clients.removeIf(client -> client.getSocket() == socket);
        }
    }

    private void broadcast(String line) {
        for (User user : clients) {
            try { user.send(line); }
            catch (IOException e) {
                clients.remove(user);
                try { user.close(); } catch (IOException ignored) { }
            }
        }
    }

    @Override public void close() throws IOException {
        closed = true;
        server.close();
        for (User user : clients) user.close();
        clients.clear();
        executor.shutdownNow();
    }

    public static void main(String[] args) throws IOException {
        int port = args.length > 0 ? Integer.parseInt(args[0]) : 5050;
        try (ChatServer server = new ChatServer(port)) {
            System.out.println("Сетевой чат запущен на порту " + server.getPort());
            server.serve();
        }
    }
}
