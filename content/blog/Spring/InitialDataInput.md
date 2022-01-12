---
title: 'h2 database 초기 데이터 세팅'
date: 2021-03-15 08:30:00
category: 'Spring'
draft: false
---
h2 database 를 사용하다보면 Application 을 재실행할 때마다 작업했던 데이터가 다 초기화되는데, 조회 기능을 테스트할 때보면 테스트 코드 외에 직접 데이터로 보고 싶을 때가 있다. 나만 그런지 모르겠지만 일단 나는 그렇다. 그래서 초기 데이터 삽입하는 방법을 정리해보려고 한다.

## 1. sql 파일 생성하기
src/main/resource 경로에 sql 파일을 생성하는 방법이다. 
해당 파일에 Insert 쿼리문을 작성하면 된다.
아래와 같이 쿼리를 작성한 후, data.sql 이름으로 파일을 생성했다.
```sql
INSERT INTO MEMBER(ID, NAME, USER_ID) values ('1','이준수', 'lee.junsu');
```
해당 파일을 실행시키기 위해, 아래와 같은 설정을 추가해준다.
```text
spring.datasource.data=classpath:data.sql
```

이 방법을 사용할 경우, 주의해야할 점이 있다.  
**바로 Primary Key 생성 전략이다.**   
@GeneratedValue 어노테이션의 기본전략은 GenerationType.AUTO 이다. 해당 전략을 사용했을 때, 테이블이 어떻게 생성되는지 DDL 을 확인해보면 아래와 같다.
```sql
drop table if exists member CASCADE 

drop sequence if exists hibernate_sequence

create sequence hibernate_sequence start with 1 increment by 1
 
create table member (
    id bigint not null,
    name varchar(255) not null,
    user_id varchar(255) not null,
    primary key (id)
)
```
시퀀스가 생성되는 것을 확인할 수 있다. 위에서 insert 할 때, id 값에 1을 넣었기 때문에 시퀀스는 그 다음 값인 2를 가리키겠지라고 기대하겠지만 그건 착각이다.
그래서 저장 로직을 실행해보면 primary key 오류가 날 것이다. 시퀀스가 생성한 값은 1인데, 1을 id로 가지는 데이터가 이미 있으니말이다.  

이를 해결하기 위해서는 insert 쿼리를 수정하거나 primary key 전략을 수정해야한다.  
아래와 같이 쿼리문을 수정하면 정상적으로 동작한다.
```sql
INSERT INTO MEMBER(ID, NAME, USER_ID) values (hibernate_sequence.NEXTVAL,'이준수', 'lee.junsu');
```

## 2. EventListener 사용하기
이벤트 방식으로 해당 이벤트가 발생할 때, 리스너를 사용해서 처리하는 것이다.
어플리케이션이 정상적으로 실행되었을 때를 나타내는 "ApplicationReadyEvent"을 EventListener에 등록하는 방법이다.
@EventListener 어노테이션에 해당 이벤트를 적어주기만 하면 된다.
아래와 같이 DTO 객체를 생성한 후, saveMember() 메소드를 실행시켜주었다. 

```java
@SpringBootApplication
public class DemoSpringApplication {
    private final MemberService memberService;

    public DemoSpringApplication(MemberService memberService) {
        this.memberService = memberService;
    }

    public static void main(String[] args) {
        SpringApplication.run(DemoSpringApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void dataLoad() {
        System.out.println("ApplicationReadyEvent 실행!");
        MemberDto memberDto = new MemberDto();
        memberDto.setName("삼준수");
        memberDto.setUser("sssss");
        memberService.saveMember(memberDto);
    }
}
```
이벤트로 처리하는 방식은 처음 알게 되었는데, 이벤트 처리에 대해서 Spring 에서 어떻게 동작하는지 좀 더 자세히 알아보고 추가로 정리해야겠다..