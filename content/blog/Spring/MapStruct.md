---
title: 'MapStruct 사용법'
date: 2021-03-09 12:30:00
category: 'Spring'
draft: false
---
## MapStruct 란?
Mapstruct 는 클래스 간 변환을 지원해주는 라이브러리이다. 

## 클래스 간 변환이 왜 필요한가?
Entity 클래스를 Request/Response 클래스로 사용하지 않기 위함이다. Entity 클래스가 변경되면 여러 클래스에 영향을 끼치므로 DB Layer 와 View Layer 를 분리해서 사용해야만 한다.  
DTO 객체는 View Layer와 데이터를 주고 받을 때 사용하고, Entity 객체는 DB Layer와 데이터를 주고 받을 때 사용한다. 따라서 DTO 객체에서 Entity 객체로 혹은 Entity 객체에서 DTO 객체로의 변환이 필요하고, 해당 변환을 지원해주는 라이브러리가 MapStruct 이다.

## Maven 설정
1. dependency 추가
```text
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>1.4.2.Final</version>
</dependency>
```

2. Annotation Processing 관련 설정 추가
```text
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <version>3.8.1</version>
    <configuration>
        <source>1.8</source>
        <target>1.8</target>
        <annotationProcessorPaths>
            <path>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>${lombok.version}</version>
            </path>
            <path>
                <groupId>org.mapstruct</groupId>
                <artifactId>mapstruct-processor</artifactId>
                <version>1.4.2.Final</version>
            </path>
        </annotationProcessorPaths>
    </configuration>
</plugin>
```
## Entity 및 DTO 클래스 작성
```java
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member {
    @Id @GeneratedValue
    private Long id;
    private String name;
    private String userId;

    @Builder
    public Member(String name, String userId) {
        this.name = name;
        this.userId = userId;
    }
}
```
```java
@Getter
@Setter
public class MemberDto {
    private Long id;
    private String user;
    private String name;
}
```
필드명이 다른 DTO 클래스를 작성했다.

## Mapper 작성
```java
@Mapper(componentModel = "spring")
public interface MemberMapper {
    @Mapping(source = "user", target = "userId")
    Member toEntity(MemberDto dto);

    @Mapping(source = "userId", target = "user")
    MemberDto toDto(Member entity);
}
```
위와 같이 필드 명이 다를 경우, @Mapping 어노테이션을 사용해서 지정해줄 수 있다.  
Maven Build를 해보면 @Mapper 어노테이션이 붙어있는 인터페이스를 구현한 구현체가 생성됨을 확인할 수 있었다. 생성된 코드는 아래와 같다. getter 와 Builder pattern 을 통해 변환하고 있음을 알 수 있다.
```java
@Component
public class MemberMapperImpl implements MemberMapper {
    public MemberMapperImpl() {
    }

    public Member toEntity(MemberDto dto) {
        if (dto == null) {
            return null;
        } else {
            String userId = null;
            String name = null;
            userId = dto.getUser();
            name = dto.getName();
            Member member = new Member(name, userId);
            return member;
        }
    }

    public MemberDto toDto(Member entity) {
        if (entity == null) {
            return null;
        } else {
            MemberDto memberDto = new MemberDto();
            memberDto.setUser(entity.getUserId());
            memberDto.setId(entity.getId());
            memberDto.setName(entity.getName());
            return memberDto;
        }
    }
}
``` 

## 저장과 조회 메소드 작성
```java
@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {
    private final MemberRepository memberRepository;
    private final MemberMapper memberMapper;

    @Override
    public List<MemberDto> getMemberList() {
        List<Member> memberList = memberRepository.findAll();
        return memberList.stream()
                .map(memberMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Long saveMember(MemberDto memberDto) {
        Member saved = memberRepository.save(memberMapper.toEntity(memberDto));
        return saved.getId();
    }
}
```
작성한 매퍼를 생성자 주입 방식으로 의존성을 주입한 후, 위와 같이 사용하였다. DTO 클래스와 Entity 클래스 간의 필드가 동일하기 때문에 손쉽게 매퍼를 작성하고, 사용할 수 있었다. 
필드가 다르거나 추가적인 필드가 더 있는 경우 어떻게 매핑해줘야 하는지 더 알아봐야하지만 일단 객체 변환을 지원해주는 Mapstruct 라이브러리는 Builder 패턴을 사용해서 매핑해주는 방법보단 훨씬 간편해보인다.  
 