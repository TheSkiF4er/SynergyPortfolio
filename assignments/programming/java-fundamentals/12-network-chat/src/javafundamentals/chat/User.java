package javafundamentals.chat;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.Closeable;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.Socket;
import java.nio.charset.StandardCharsets;

/** Тема 12: имя, сокет и оба потока, как требуется в задании. */
public final class User implements Closeable {
    private String name;
    private final Socket socket;
    private final BufferedReader input;
    private final BufferedWriter output;

    public User(Socket socket) throws IOException {
        this.socket = socket;
        this.input = new BufferedReader(new InputStreamReader(socket.getInputStream(), StandardCharsets.UTF_8));
        this.output = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream(), StandardCharsets.UTF_8));
    }

    public void setName(String candidate) {
        if (name != null) throw new IllegalStateException("Имя можно установить один раз");
        if (candidate == null || !candidate.matches("[\\p{L}0-9_-]{1,24}")) {
            throw new IllegalArgumentException("Имя: 1–24 буквы/цифры/_/-");
        }
        name = candidate;
    }
    public String getName() { return name; }
    public Socket getSocket() { return socket; }
    public BufferedReader getInput() { return input; }
    public BufferedWriter getOutput() { return output; }

    /** Потокобезопасная запись: клиент может получать сообщения разных потоков. */
    public synchronized void send(String message) throws IOException {
        output.write(message);
        output.newLine();
        output.flush();
    }

    @Override public void close() throws IOException { socket.close(); }
}
