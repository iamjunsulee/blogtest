---
title: 'Custom Annotation'
date: 2021-03-08 11:30:00
category: 'Spring'
draft: false
---
## Custom Annotation
@RequestMapping(method = RequestMethod.GET) 어노테이션이 @GetMapping 어노테이션으로 간편하게 사용할 수 있는 이유는 해당 설정을 한 GetMapping이라는 커스텀 어노테이션을 제공하고 있기 때문이다.  
아래의 GetMapping 어노테이션을 확인해보면 method 설정이 되어있는 것을 알 수 있다. 그래서 GetMapping 어노테이션을 사용하면 Get 요청을 처리할 수 있는 것이다.
```java
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@RequestMapping(
    method = {RequestMethod.GET}
)
public @interface GetMapping {
    @AliasFor(
        annotation = RequestMapping.class
    )
    String name() default "";

    @AliasFor(
        annotation = RequestMapping.class
    )
    String[] value() default {};

    @AliasFor(
        annotation = RequestMapping.class
    )
    String[] path() default {};

    @AliasFor(
        annotation = RequestMapping.class
    )
    String[] params() default {};

    @AliasFor(
        annotation = RequestMapping.class
    )
    String[] headers() default {};

    @AliasFor(
        annotation = RequestMapping.class
    )
    String[] consumes() default {};

    @AliasFor(
        annotation = RequestMapping.class
    )
    String[] produces() default {};
}
```
어노테이션에 대해 하나씩 알아보자.
1. @Target  
   해당 어노테이션을 적용할 수 있는 위치를 설정하는 어노테이션이다. 값으로 ElementType enum(TYPE, FIELD, METHOD, PARAMETER, CONSTRUCTOR, LOCAL_VARIABLE, ANNOTATION_TYPE, PACKAGE, TYPE_PARAMETER, TYPE_USE, MODULE)을 값으로 가진다.
   

2. @Retention  
   어노테이션을 어디까지 유지할지를 설정하는 어노테이션이다. RetentionPolicy enum(SOURCE, CLASS, RUNTIME)을 값으로 가진다.  
   SOURCE는 말 그대로 소스까지만 유지된다. 컴파일 시 사라진다.
   CLASS는 컴파일까지만 유지된다. class file에는 남아있지만, VM에서 실행하는동안에는 사용할 수 없다.  
   RUNTIME은 VM에서 실행하는 동안에도 유지된다.
   

3. @Documented  
   javadoc으로 api 문서를 만들 때 해당 정보가 표시된다.

GetMapping 어노테이션 내부에 선언된 메소드를 보자. @AliasFor라는 어노테이션이 메소드들 위에 선언되어있다.
```text
@AliasFor(
    annotation = RequestMapping.class
)
```
@AliasFor 은 속성을 선언하는 데 사용하는 어노테이션이고, 위와 같이 사용되었을 때 의미는 RequestMapping 클래스의 속성을 재정의하겠다는 뜻이다.
그래서 @GetMapping("/hello") 이렇게 속성값을 넣어 사용할 수 있는 것이다. 

위 어노테이션을 참고하여 커스텀 어노테이션을 작성해보았다.
```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@RequestMapping(method = RequestMethod.GET)
public @interface HelloBook {
    @AliasFor(
            annotation = RequestMapping.class
    )
    String value();
}
```
```java
public class EventController {
    @HelloBook("/helloBook")
    @ResponseBody
    public String getHelloBook() { return "Hello Book"; }
}
```
@RequestMapping 어노테이션의 value 속성을 재정의했기 때문에 @HelloBook 어노테이션에 value 값을 넣어줄 수 있다. 해당 컨트롤러를 테스트하는 코드를 아래와 같이 작성해보았다.
```java
class EventControllerTest {
    @Test
    public void customAnnotationTest() throws Exception {
        this.mockMvc.perform(get("/helloBook"))
                .andDo(print())
                .andExpect(content().string("Hello Book"))
        ;
    }
}
```
```text
MockHttpServletResponse:
           Status = 200
    Error message = null
          Headers = [Content-Type:"text/plain;charset=UTF-8", Content-Length:"10"]
     Content type = text/plain;charset=UTF-8
             Body = Hello Book
    Forwarded URL = null
   Redirected URL = null
          Cookies = []
```
결과는 이렇게 성공한다. 

참고  
<https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/core/annotation/AliasFor.html>