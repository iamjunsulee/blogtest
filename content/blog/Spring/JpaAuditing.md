---
title: 'JPA Auditing'
date: 2022-01-31 19:30:00
category: 'Spring'
draft: false
---
## JPA Auditing 이란 ?
도메인 설계를 하다 보면 생성 일자, 수정 일자와 같은 공통 컬럼들이 있습니다.</br>
공통 컬럼들을 각각의 엔티티에서 처리해 준다고 하면 그만큼 반복되는 코드들이 많이 생길 것입니다.</br>
이 때 Spring Data JPA에서 시간에 대해서 자동으로 값을 넣어주는 기능을 제공하는 데, 그게 바로 Auditing 기능입니다.

## Auditing 사용법
### 1. 추상 클래스 작성
BaseEntity라는 추상 클래스를 정의해서 공통 컬럼이 필요한 각 엔티티마다 상속해서 구현합니다.</br>
아래는 생성 일자와 수정 일자를 가지는 추상 클래스입니다.
```java
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Getter
public abstract class BaseEntity {
    @CreatedDate
    public LocalDateTime createDate;

    @LastModifiedDate
    public LocalDateTime updateDate;
}
```
위 추상 클래스에 정의한 어노테이션에 대해 더 알아봅시다.

#### 1-1. @MappedSuperclass
공통 매핑 정보가 필요할 때 사용하는 어노테이션입니다. 해당 어노테이션을 사용하면 엔티티나 테이블과 매핑되지 않으며 자식 클래스에 대한 매핑 정보만 제공해줍니다.

#### 1-2. @EntityListeners(AuditingEntityListener.class)
AuditingEntityListener 클래스는 Spring Data JPA에서 제공하는 EntityListener 클래스입니다. 해당 클래스에서 @PrePersist, @PreUpdate 설정을 통해 엔티티가 영속화 되기 전에 AuditingHandler 클래스에 의해 생성일, 수정일을 자동으로 설정해줍니다. </br>
아래의 코드에서 자세히 확인할 수 있습니다.</br>
```java
private <T> T touch(Auditor auditor, T target, boolean isNew) {
    Optional<AuditableBeanWrapper<T>> wrapper = this.factory.getBeanWrapperFor(target);
    return wrapper.map((it) -> {
        this.touchAuditor(auditor, it, isNew);
        Optional<TemporalAccessor> now = this.dateTimeForNow ? this.touchDate(it, isNew) : Optional.empty();
        if (logger.isDebugEnabled()) {
            Object defaultedNow = now.map(Object::toString).orElse("not set");
            Object defaultedAuditor = auditor.isPresent() ? auditor.toString() : "unknown";
            logger.debug(LogMessage.format("Touched %s - Last modification at %s by %s", target, defaultedNow, defaultedAuditor));
        }

        return it.getBean();
    }).orElse(target);
}

private Optional<TemporalAccessor> touchDate(AuditableBeanWrapper<?> wrapper, boolean isNew) {
    Assert.notNull(wrapper, "AuditableBeanWrapper must not be null!");
    Optional<TemporalAccessor> now = this.dateTimeProvider.getNow();
    Assert.notNull(now, () -> {
        return String.format("Now must not be null! Returned by: %s!", this.dateTimeProvider.getClass());
    });
    now.filter((__) -> {
        return isNew;
    }).ifPresent(wrapper::setCreatedDate);
    now.filter((__) -> {
        return !isNew || this.modifyOnCreation;
    }).ifPresent(wrapper::setLastModifiedDate);
    return now;
}
```

#### 1-3. @CreatedDate
엔티티가 생성되어 저장될 때 시간을 자동 저장합니다.

#### 1-4. @LastModifiedDate
엔티티의 값이 변경된 시간을 자동 저장합니다.

### 2. 추상 클래스 상속
공통 컬럼을 사용할 엔티티에서 추상 클래스로 작성한 BaseEntity를 상속받습니다.
```java
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member extends BaseEntity{
    @Id @GeneratedValue
    @Column(name = "member_id")
    private Long id;            //회원번호

    private String name;        //회원명

    @Embedded
    private Address address;    //주소
}
```

### 3. JPA Auditing 활성화
@EnableJpaAuditing 어노테이션 설정을 통해 JPA Auditing 활성화를 합니다.
```java
@SpringBootApplication
@EnableJpaAuditing
public class DemoJpaStudyApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoJpaStudyApplication.class, args);
    }
}
```

### 4. 테스트
```java
@Test
public void auditing_test() {
    Address address = new Address("서울", "강남구", "01234");
    Member member = new Member("이준수", address);
    memberRepository.save(member);
    LocalDateTime createDate = member.getCreateDate();
    member.updateMemberInfo("삼준수", address);
    Member save = memberRepository.save(member);
    LocalDateTime updateDate = save.getUpdateDate();
    assertNotEquals(createDate, updateDate);
}
```
Member 객체를 하나 생성하고, 이름을 수정한 후 생성일과 수정일을 비교해보았습니다.</br>
처음에 insert 쿼리를 보면 create_date, update_date 컬럼 값이 동일하게 2022-01-31T21:05:11.551411200 인 것을 알 수 있습니다.</br>
그러나 이름을 수정한 후, 저장한 경우 변경 감지에 의해 update 쿼리가 실행되는 데, 해당 쿼리를 보면 update_date가 2022-01-31T21:05:11.582480600 임을 확인할 수 있습니다.</br></br>
__위와 같은 설정을 통해 JPA Auditing 기능을 사용하여 생성일, 수정일을 자동화할 수 있습니다.__
```
    insert 
    into
        member
        (create_date, update_date, city, street, zipcode, name, member_id) 
    values
        (?, ?, ?, ?, ?, ?, ?)
2022-01-31 21:05:11.554 TRACE 22808 --- [           main] o.h.type.descriptor.sql.BasicBinder      : binding parameter [1] as [TIMESTAMP] - [2022-01-31T21:05:11.551411200]
2022-01-31 21:05:11.554 TRACE 22808 --- [           main] o.h.type.descriptor.sql.BasicBinder      : binding parameter [2] as [TIMESTAMP] - [2022-01-31T21:05:11.551411200]
2022-01-31 21:05:11.554 TRACE 22808 --- [           main] o.h.type.descriptor.sql.BasicBinder      : binding parameter [3] as [VARCHAR] - [서울]
2022-01-31 21:05:11.554 TRACE 22808 --- [           main] o.h.type.descriptor.sql.BasicBinder      : binding parameter [4] as [VARCHAR] - [강남구]
2022-01-31 21:05:11.554 TRACE 22808 --- [           main] o.h.type.descriptor.sql.BasicBinder      : binding parameter [5] as [VARCHAR] - [01234]
2022-01-31 21:05:11.554 TRACE 22808 --- [           main] o.h.type.descriptor.sql.BasicBinder      : binding parameter [6] as [VARCHAR] - [이준수]
2022-01-31 21:05:11.555 TRACE 22808 --- [           main] o.h.type.descriptor.sql.BasicBinder      : binding parameter [7] as [BIGINT] - [41]

update
        member 
    set
        create_date=?,
        update_date=?,
        city=?,
        street=?,
        zipcode=?,
        name=? 
    where
        member_id=?
2022-01-31 21:05:11.583 TRACE 22808 --- [           main] o.h.type.descriptor.sql.BasicBinder      : binding parameter [1] as [TIMESTAMP] - [2022-01-31T21:05:11.551411200]
2022-01-31 21:05:11.584 TRACE 22808 --- [           main] o.h.type.descriptor.sql.BasicBinder      : binding parameter [2] as [TIMESTAMP] - [2022-01-31T21:05:11.582480600]
```