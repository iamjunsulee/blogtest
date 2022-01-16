---
title: 'Querydsl 적용하여 페이징 처리하기'
date: 2022-01-16 20:30:00
category: 'Spring'
draft: false
---
Spring Data의 Pageable 인터페이스와 Querydsl을 사용하여 페이징 처리하는 방법을 정리하고자 한다.

### Repository 코드
상품 repository이고, 전체 상품을 조회하는 메소드이다.
```java
@Repository
@RequiredArgsConstructor
public class ItemQueryRepository {
    private final JPAQueryFactory jpaQueryFactory;

    public Page<Item> findItems(Pageable pageable) {
        QueryResults<Item> itemQueryResults = jpaQueryFactory
                .selectFrom(item)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetchResults();
        List<Item> content = itemQueryResults.getResults();
        return new PageImpl<>(content, pageable, itemQueryResults.getTotal());
    }
}
```

### fetchResult() 메소드
```java
public QueryResults<T> fetchResults() {
    QueryResults var4;
    try {
        Query countQuery = this.createQuery((QueryModifiers)null, true);
        long total = (Long)countQuery.getSingleResult();
        if (total > 0L) {
            QueryModifiers modifiers = this.getMetadata().getModifiers();
            Query query = this.createQuery(modifiers, false);
            List<T> list = this.getResultList(query);
            QueryResults var7 = new QueryResults(list, modifiers, total);
            return var7;
        }
        var4 = QueryResults.emptyResults();
    } finally {
        this.reset();
    }
    return var4;
}
```
findItems 메소드를 보면 querydsl로 쿼리를 만들고 마지막에 fetchResults()로 데이터를 가져온다.</br>
fetchResults() 메소드를 살펴보면 전체 카운트를 조회하는 쿼리, 조회 결과를 가져오는 쿼리 __총 2개의 쿼리가 항상 실행된다.__</br>
```
2022-01-16 18:22:50.693 DEBUG 2004 --- [nio-8080-exec-1] org.hibernate.SQL                        : 
    select
        count(item0_.item_id) as col_0_0_ 
    from
        item item0_
2022-01-16 18:22:50.702 DEBUG 2004 --- [nio-8080-exec-1] org.hibernate.SQL                        : 
    select
        item0_.item_id as item_id2_1_,
        item0_.name as name3_1_,
        item0_.price as price4_1_,
        item0_.stock_quantity as stock_qu5_1_,
        item0_.author as author6_1_,
        item0_.dtype as dtype1_1_ 
    from
        item item0_ limit ?
```
만약 page size보다 적은 양의 데이터라면 전체 카운트를 굳이 조회할 필요가 있을까..하는 생각이 들긴 한다.</br>

### Page 구현체
```java
public class PageImpl<T> extends Chunk<T> implements Page<T> {
    private static final long serialVersionUID = 867755909294344406L;
    private final long total;

    public PageImpl(List<T> content, Pageable pageable, long total) {
        super(content, pageable);
        this.total = (Long)pageable.toOptional().filter((it) -> {
            return !content.isEmpty();
        }).filter((it) -> {
            return it.getOffset() + (long)it.getPageSize() > total;
        }).map((it) -> {
            return it.getOffset() + (long)content.size();
        }).orElse(total);
    }
    ... 중략
}

```
findItems() 메소드를 보면 Page 인터페이스의 구현체인 PageImpl 객체로 리턴하고 있다.</br>
PageImpl 클래스는 위에서 보듯이 content(조회 결과물), pageable(page 요청 데이터), total(전체 개수)를 인자로 가진다.