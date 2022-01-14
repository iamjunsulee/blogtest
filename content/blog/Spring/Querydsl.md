---
title: 'Querydsl 적용하기'
date: 2022-01-13 14:30:00
category: 'Spring'
draft: false
---
SpringBoot Data Jpa 프로젝트에서 Querydsl을 적용하는 방법을 정리하고자 한다.</br>
기본적으로 제공해주는 쿼리로는 다양한 조회 기능을 사용하기에는 한계가 있으므로 Querydsl을 적용시켜보려고 한다.

## Querydsl 설정하기
maven 기준으로 Querydsl 설정하는 방법은 아래와 같다.

### 1. 의존성 추가하기
QueryDsl 관련 라이브러리
```
<dependency>
    <groupId>com.querydsl</groupId>
    <artifactId>querydsl-jpa</artifactId>
    <version>4.2.1</version>
</dependency>
```
Q클래스 생성
```
<dependency>
    <groupId>com.querydsl</groupId>
    <artifactId>querydsl-apt</artifactId>
    <version>4.2.1</version>
</dependency>
```

### 2. 플러그인 추가하기
queryDsl 기반 코드를 생성하기 위한 플러그인을 추가한다.
Entity 어노테이션이 추가된 도메인에 대해 outputDirectory에 설정한 경로에 QClass를 생성해준다.
```
<plugin>
    <groupId>com.mysema.maven</groupId>
    <artifactId>apt-maven-plugin</artifactId>
    <version>1.1.3</version>
    <executions>
        <execution>
            <goals>
                <goal>process</goal>
            </goals>
            <configuration>
                <outputDirectory>target/generated-sources/java</outputDirectory>
                <processor>com.querydsl.apt.jpa.JPAAnnotationProcessor</processor>
            </configuration>
        </execution>
    </executions>
</plugin>
```

### 3. Q클래스 생성하기
인텔리제이 기준 Maven 마우스 우 클릭 > Generate Sources and Update Folders 을 선택한다.</br>
위 플러그인 설정에서 outputDirectory에 설정한 경로에 아래와 같이 Q클래스가 생성된다.

![maven](./images/qClass.PNG) 

## Querydsl 사용하기
### 1. Configuration 클래스 생성하기
config 패키지를 만들어서 아래와 같이 QueryDslConfig 클래스를 작성한다.</br>
Bean으로 등록해서 프로젝트 어디에서나 JPAQueryFactory를 주입받아 Querydsl을 사용할 수 있도록 한다.
```java
@Configuration
public class QueryDslConfig {
    @PersistenceContext
    private EntityManager entityManager;

    @Bean
    public JPAQueryFactory jpaQueryFactory() {
        return new JPAQueryFactory(entityManager);
    }
}
```
### 2. Repository 생성
아래와 같이 Bean으로 등록된 JPAQueryFactory를 주입받아 사용한다.</br>
Member Entity의 QClass를 import하여 사용한다.</br>
BooleanBuilder를 사용해서 파라미터 name의 값이 null이 아닌 경우에만 where 조건절에 들어가는 동적 쿼리 메소드를 작성한다.
```java
import static me.junsu.demojpastudy.domain.QMember.member;

@RequiredArgsConstructor
@Repository
public class MemberQueryRepository {
    private final JPAQueryFactory jpaQueryFactory;

    public List<Member> findMembersByName(String name) {
        BooleanBuilder builder = new BooleanBuilder();

        if (!Objects.isNull(name)) {
            builder.and(member.name.eq(name));
        }

        return jpaQueryFactory.selectFrom(member)
                .where(builder)
                .fetch();
    }
}
```