#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv) {
    const char *path = argc > 1 ? argv[1] : "03-io-streams/coordinates.txt";
    FILE *f = fopen(path, "r");
    if (!f) { perror("fopen"); return 1; }
    double lat, lon;
    while (fscanf(f, "%lf %lf", &lat, &lon) == 2) {
        if (lat >= 50.0 && lat <= 80.0 && lon >= 20.0 && lon <= 45.0)
            printf("%.4f %.4f\n", lat, lon);
    }
    fclose(f);
    return 0;
}
