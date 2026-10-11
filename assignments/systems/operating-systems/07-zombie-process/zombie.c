#define _POSIX_C_SOURCE 200809L
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
int main(void){pid_t p=fork();if(p<0){perror("fork");return 1;}if(p==0)_exit(0);printf("child pid=%ld; child is a zombie until waitpid() (3 seconds)\n",(long)p);fflush(stdout);struct timespec ts={3,0};nanosleep(&ts,NULL);int st=0;waitpid(p,&st,0);puts("child reaped");return 0;}
