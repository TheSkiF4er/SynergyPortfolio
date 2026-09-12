#include <arpa/inet.h>
#include <netinet/in.h>
#include <sys/socket.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
int main(int argc,char**argv){int port=argc>2?atoi(argv[2]):5050;char name[200]={0};if(argc>1)strncpy(name,argv[1],sizeof(name)-1);else{printf("Socket name: ");fgets(name,sizeof(name),stdin);name[strcspn(name,"\n")]=0;}int s=socket(AF_INET,SOCK_STREAM,0);struct sockaddr_in a={0};a.sin_family=AF_INET;a.sin_port=htons(port);inet_pton(AF_INET,"127.0.0.1",&a.sin_addr);if(connect(s,(struct sockaddr*)&a,sizeof(a))<0){perror("connect");return 1;}write(s,name,strlen(name));char b[16]={0};read(s,b,sizeof(b)-1);printf("server: %s",b);close(s);return 0;}
