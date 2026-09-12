#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#define N 3
static int A[N][N]={{1,2,3},{4,5,6},{7,8,9}},B[N][N]={{9,8,7},{6,5,4},{3,2,1}},C[N][N];
static void* row(void*arg){long r=(long)arg;for(int c=0;c<N;c++)for(int k=0;k<N;k++)C[r][c]+=A[r][k]*B[k][c];return NULL;}
int main(void){pthread_t t[N];for(long r=0;r<N;r++)if(pthread_create(&t[r],NULL,row,(void*)r)!=0)return 1;for(int r=0;r<N;r++)pthread_join(t[r],NULL);for(int r=0;r<N;r++){for(int c=0;c<N;c++)printf("%d%c",C[r][c],c==N-1?'\n':' ');}return 0;}
