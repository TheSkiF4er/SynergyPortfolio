#include <sys/socket.h>
#include <sys/un.h>
#include <unistd.h>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#define SOCK_PATH "/tmp/synergy_unix_socket"
int main(void){
  int s=socket(AF_UNIX,SOCK_STREAM,0); if(s<0){perror("socket");return 1;}
  struct sockaddr_un a={0}; a.sun_family=AF_UNIX; strncpy(a.sun_path,SOCK_PATH,sizeof(a.sun_path)-1);
  unlink(SOCK_PATH); if(bind(s,(struct sockaddr*)&a,sizeof(a))<0){perror("bind");return 1;}
  if(listen(s,1)<0){perror("listen");return 1;} printf("listening %s\n",SOCK_PATH); fflush(stdout);
  int c=accept(s,NULL,NULL); if(c<0){perror("accept");return 1;} char b[256]={0}; ssize_t n=read(c,b,sizeof(b)-1);
  if(n>0){b[n]='\0'; printf("socket name: %s\n",b); write(c,"OK\n",3);} close(c);close(s);unlink(SOCK_PATH);return 0;
}
