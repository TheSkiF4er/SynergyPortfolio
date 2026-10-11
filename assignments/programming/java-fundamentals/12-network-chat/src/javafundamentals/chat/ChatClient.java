package javafundamentals.chat;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.Socket;
import java.nio.charset.StandardCharsets;

/** Клиент: ввод из консоли, чтение сервера в отдельном потоке. */
public final class ChatClient {
    private ChatClient() {}

    public static void main(String[] args) throws IOException {
        String host = args.length > 0 ? args[0] : "127.0.0.1";
        int port = args.length > 1 ? Integer.parseInt(args[1]) : 5050;
        try (Socket socket = new Socket(host, port);
             BufferedReader server = new BufferedReader(new InputStreamReader(socket.getInputStream(), StandardCharsets.UTF_8));
             BufferedWriter output = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream(), StandardCharsets.UTF_8));
             BufferedReader console = new BufferedReader(new InputStreamReader(System.in, StandardCharsets.UTF_8))) {
            Thread receiver = new Thread(() -> {
                try { String line; while ((line = server.readLine()) != null) System.out.println(line); }
                catch (IOException ignored) { }
            }, "chat-receiver");
            receiver.setDaemon(true);
            receiver.start();
            String line;
            while ((line = console.readLine()) != null) {
                output.write(line);
                output.newLine();
                output.flush();
                if (line.equals("/quit")) break;
            }
        }
    }
}
