#define _POSIX_C_SOURCE 200809L
#include <sys/mman.h>
#include <sys/wait.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#define N 3
static int A[N][N]={{1,2,3},{4,5,6},{7,8,9}};
static int B[N][N]={{9,8,7},{6,5,4},{3,2,1}};
int main(void) {
    int (*C)[N] = mmap(NULL, sizeof(int)*N*N, PROT_READ|PROT_WRITE, MAP_SHARED|MAP_ANONYMOUS, -1, 0);
    if (C == MAP_FAILED) { perror("mmap"); return 1; }
    for (int r=0; r<N; r++) {
        pid_t p = fork();
        if (p == 0) {
            for (int c=0; c<N; c++)
                for (int k=0; k<N; k++) C[r][c] += A[r][k] * B[k][c];
            _exit(0);
        }
        if (p < 0) { perror("fork"); return 1; }
    }
    for (int r=0; r<N; r++) wait(NULL);
    for (int r=0; r<N; r++) {
        for (int c=0; c<N; c++) printf("%d%c", C[r][c], c==N-1 ? '\n' : ' ');
    }
    munmap(C, sizeof(int)*N*N);
    return 0;
}
