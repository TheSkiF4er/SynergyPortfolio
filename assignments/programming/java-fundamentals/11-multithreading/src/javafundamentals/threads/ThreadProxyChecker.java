package javafundamentals.threads;

import java.io.IOException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import javafundamentals.proxy.ProxyEndpoint;
import javafundamentals.proxy.ProxyScanner;

/** Реализация многопоточности №2: рабочий класс наследуется от Thread. */
public final class ThreadProxyChecker {
    private ThreadProxyChecker() {}

    private static final class ProbeThread extends Thread {
        private final List<ProxyEndpoint> endpoints;
        private final boolean[] reachable;
        private final AtomicInteger next;
        private final int timeoutMs;

        ProbeThread(List<ProxyEndpoint> endpoints, boolean[] reachable, AtomicInteger next, int timeoutMs, int index) {
            super("thread-proxy-" + index);
            this.endpoints = endpoints;
            this.reachable = reachable;
            this.next = next;
            this.timeoutMs = timeoutMs;
        }

        @Override public void run() {
            int position;
            while ((position = next.getAndIncrement()) < endpoints.size()) {
                reachable[position] = ProxyScanner.reachable(endpoints.get(position), timeoutMs);
            }
        }
    }

    public static List<ProxyEndpoint> scan(List<ProxyEndpoint> endpoints, int timeoutMs, int workers) throws InterruptedException {
        if (workers < 1 || workers > 32) throw new IllegalArgumentException("Потоков должно быть 1..32");
        boolean[] reachable = new boolean[endpoints.size()];
        AtomicInteger next = new AtomicInteger();
        List<ProbeThread> threads = new ArrayList<>();
        for (int i = 0; i < Math.min(workers, endpoints.size()); i++) {
            ProbeThread worker = new ProbeThread(endpoints, reachable, next, timeoutMs, i);
            threads.add(worker);
            worker.start();
        }
        for (ProbeThread thread : threads) thread.join();
        List<ProxyEndpoint> good = new ArrayList<>();
        for (int i = 0; i < endpoints.size(); i++) if (reachable[i]) good.add(endpoints.get(i));
        return good;
    }

    public static void main(String[] args) {
        try {
            Path source = Path.of(args.length > 0 ? args[0] : "proxies.txt");
            Path target = Path.of(args.length > 1 ? args[1] : "good_ip.txt");
            int workers = args.length > 2 ? Integer.parseInt(args[2]) : 8;
            List<ProxyEndpoint> good = scan(ProxyScanner.load(source), 750, workers);
            ProxyScanner.save(target, good);
            System.out.println("Thread: доступных TCP-портов " + good.size());
        } catch (IOException | IllegalArgumentException | InterruptedException e) {
            if (e instanceof InterruptedException) Thread.currentThread().interrupt();
            System.err.println("Ошибка: " + e.getMessage());
            System.exit(1);
        }
    }
}
