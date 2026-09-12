#include <sys/socket.h>
#include <sys/un.h>
#include <unistd.h>
#include <stdio.h>
#include <string.h>
#define SOCK_PATH "/tmp/synergy_unix_socket"
int main(int argc,char **argv){char name[200]={0}; if(argc>1)strncpy(name,argv[1],sizeof(name)-1);else{printf("Socket name: ");fflush(stdout);if(!fgets(name,sizeof(name),stdin))return 1;name[strcspn(name,"\n")]=0;}
 int s=socket(AF_UNIX,SOCK_STREAM,0);if(s<0){perror("socket");return 1;}struct sockaddr_un a={0};a.sun_family=AF_UNIX;strncpy(a.sun_path,SOCK_PATH,sizeof(a.sun_path)-1);if(connect(s,(struct sockaddr*)&a,sizeof(a))<0){perror("connect");return 1;}write(s,name,strlen(name));char b[16]={0};read(s,b,sizeof(b)-1);printf("server: %s",b);close(s);return 0;}
