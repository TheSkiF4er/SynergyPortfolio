#include <arpa/inet.h>
#include <netinet/in.h>
#include <sys/socket.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
int main(int argc,char**argv){int port=argc>1?atoi(argv[1]):5050;int s=socket(AF_INET,SOCK_STREAM,0);int yes=1;setsockopt(s,SOL_SOCKET,SO_REUSEADDR,&yes,sizeof(yes));struct sockaddr_in a={0};a.sin_family=AF_INET;a.sin_addr.s_addr=htonl(INADDR_LOOPBACK);a.sin_port=htons(port);if(bind(s,(struct sockaddr*)&a,sizeof(a))<0){perror("bind");return 1;}listen(s,1);printf("127.0.0.1:%d\n",port);fflush(stdout);int c=accept(s,NULL,NULL);char b[256]={0};ssize_t n=read(c,b,sizeof(b)-1);if(n>0){printf("name: %s\n",b);write(c,"OK\n",3);}close(c);close(s);return 0;}
