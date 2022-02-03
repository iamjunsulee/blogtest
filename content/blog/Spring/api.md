---
title: API 작성시, Entity 직접 반환하면 안되는 이유
date: 2022-02-03 15:30:00
category: 'Spring'
draft: false
---
## API 작성시, Entity 직접 반환하면 안되는 이유
API를 작성할 때에는 Entity를 직접 반환하면 안됩니다.</br>
왜 직접 반환하면 안되는지 알아보도록 하겠습니다.</br></br>
우선 회원 ID, 이름, 주소를 필요로 하는 api를 작성한다고 가정합시다.
```java
@GetMapping("/api/members")
public List<Member> getMembers() {
    return memberService.findAll();
}
```
위와 같이 Api를 작성했을 경우, 해당 api의 결과는 아래와 같습니다.</br>
```
[
    {
        "createDate": "2022-02-03T15:25:13.655",
        "updateDate": "2022-02-03T15:25:13.655",
        "id": 1,
        "name": "이준수",
        "address": {
            "city": "서울특별시",
            "street": "마포구 마포대로",
            "zipcode": "04413"
        },
        "orders": []
    },
    {
        "createDate": "2022-02-03T15:25:13.673",
        "updateDate": "2022-02-03T15:25:13.673",
        "id": 2,
        "name": "삼준수",
        "address": {
            "city": "부산광역시",
            "street": "금정구",
            "zipcode": "01111"
        },
        "orders": []
    }
]
```
필요로 하는 정보는 ID, 이름, 주소이지만 응답 결과를 보면 엔티티의 모든 정보가 외부로 노출되었습니다.</br>
필요 없는 정보를 노출시키지 않기 위해  @JsonIgnore 어노테이션을 사용해 보겠습니다.</br>
```
[
    {
        "id": 1,
        "name": "이준수",
        "address": {
            "city": "서울특별시",
            "street": "마포구 마포대로",
            "zipcode": "04413"
        }
    },
    {
        "id": 2,
        "name": "삼준수",
        "address": {
            "city": "부산광역시",
            "street": "금정구",
            "zipcode": "01111"
        }
    }
]
```
결과가 위와 같이 나오니 원하는 대로 api 작성을 잘한 듯 보입니다. 그러나 이 방법에도 문제가 있습니다.</br>
@JsonIgnore를 사용해서 특정 컬럼들을 노출 안 시키게 할 수 있으나 엔티티에 프레젠테이션 로직이 들어가 버렸습니다.
__용도에 따라 API가 다양하게 만들어질 텐데 그럴 때마다 해당 스펙을 맞추기 위해 프레젠테이션 응답 로직을 엔티티에 다 담기는 너무 어렵습니다.__</br>
__또 다른 문제는 엔티티를 변경할 일이 있어 변경하게 되면 API 스펙 자체가 바뀌게 된다는 점입니다.__</br>

## 해결방안
해결방안은 간단합니다. 엔티티를 반환하지 않으면 됩니다.

### 1. DTO로 반환하기
처음에 우리가 원하는 API는 회원의 ID, 이름, 주소를 제공하는 것입니다. 따라서 해당 정보만 가지는 DTO 클래스를 따로 생성해줍니다.
```java
@Data
@AllArgsConstructor
static class MemberDto {
    private Long id;
    private String name;
    private Address address;
}
```

### 2. 별도의 Result 클래스를 생성해서 사용하기
별도의 Result 클래스를 생성해서 엔티티를 DTO 객체로 변환한 결과를 반환하도록 합니다.</br>
아래와 같이 전체 결과 수를 count라는 컬럼에 담는 것처럼 원하는 API 스펙에 맞춰서 유연하게 작성할 수 있습니다.  
```java
@Data
@AllArgsConstructor
static class Result<T> {
    private int count;
    private T data;
}
```

### 3. 최종 작성 API
```java
@GetMapping("/api/members")
public Result<List<MemberDto>> getMembersV2(@RequestParam(required = false) String name) {
    List<Member> memberList = memberQueryRepository.findMembersByName(name);
    List<MemberDto> result = memberList.stream()
            .map(m -> new MemberDto(m.getId(), m.getName(), m.getAddress())).collect(Collectors.toList());
    return new Result<>(result.size(), result);
}
```
1, 2의 방법들을 사용하여 최종적으로 위의 API를 작성하였습니다.</br>
위 API의 응답 결과를 보면 아래와 같습니다.
```
{
    "count": 2,
    "members": [
        {
            "id": 1,
            "name": "이준수",
            "address": {
                "city": "서울특별시",
                "street": "마포구 마포대로",
                "zipcode": "04413"
            }
        },
        {
            "id": 2,
            "name": "삼준수",
            "address": {
                "city": "부산광역시",
                "street": "금정구",
                "zipcode": "01111"
            }
        }
    ]
}
```


