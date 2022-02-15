---
title: Docker 및 Kafka 설치
date: 2022-02-15 23:00:00
category: 'Install'
draft: false
---
## Docker 설치
WSL2를 설치하고 활성화를 했다면 설치 파일을 다운로드 받은 다음 설치만 진행하면 됩니다.</br>
WSL2 설치하고 활성화하는 방법은 이전 포스트인 Docker 설치하기 전에 WSL2 설치 및 활성화를 참고하면 됩니다.

## Kafka 설치
### 1. docker-compose.yml 파일 작성
```
version: '2'
services:
  zookeeper:
    image: wurstmeister/zookeeper
    container_name: zookeeper
    ports:
      - "2181:2181"
  kafka:
    image: wurstmeister/kafka
    container_name: kafka
    ports:
      - "9092:9092"
    environment:
      KAFKA_ADVERTISED_HOST_NAME: 127.0.0.1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
```

### 2. kafka 설치
아래의 명령어를 사용해서 설치합니다.
```
$ docker-compose up -d
```
만약에 docker-compose.yml 이 아닌 다른 이름을 가진 docker-compose를 실행시킬 경우 -f 옵션을 사용해서 해당 파일 명을 적어줘야 합니다.
```
$ docker-compose -f docker-compose-single-broker.yml up -d
```

### 3. 컨테이너 확인
docker-compose.yml 파일을 통해 생성된 컨테이너가 있는지 확인합니다. 위 설정을 통해 생성한다면 kafka, zookeeper 이름의 컨테이너가 생성되었는지 확인하면 됩니다.
```
$ docker ps -a
```

### 4. 컨테이너 접속
```
$ docker exec -it kafka bash
```