---
title: '@RequestParam'
date: 2021-03-11 15:30:00
category: 'Spring'
draft: false
---
@RequestParam 어노테이션은 Http 요청 매개변수에 들어있는 데이터(쿼리 파라미터, 폼 데이터, 멀티파일)를 메소드의 파라미터로 전달받을 때 사용한다.

```java
@Controller
public class EventController {
    @GetMapping("/event")
    @ResponseBody
    public String getParameter(@RequestParam String name) {
        return "name : " + name;
    }
}
```
위와 같이 요청을 처리하는 컨트롤러의 메소드를 작성하고, 아래와 같이 테스트를 해보면 정상적으로 동작함을 알 수 있다.
```java
class EventControllerTest {
    @Test
    public void getParameterTest() throws Exception {
        this.mockMvc.perform(get("/event").param("name", "junsu"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string("name : junsu"))
        ;
    }
}
```
만약 요청 파라미터가 없는 경우에는 어떻게 될까?
```text
MockHttpServletResponse:
           Status = 400
    Error message = Required String parameter 'name' is not present
          Headers = []
     Content type = null
             Body = 
    Forwarded URL = null
   Redirected URL = null
          Cookies = []
```
name 파라미터를 보내지 않았기 때문에 400 응답코드를 반환한다.
파라미터가 없는 경우에는 어떻게 처리해야할까? 우선 @RequestParam 어노테이션을 자세히 살펴보자.
```java
@Target({ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RequestParam {
    @AliasFor("name")
    String value() default "";

    @AliasFor("value")
    String name() default "";

    boolean required() default true;

    String defaultValue() default "\n\t\t\n\t\t\n\ue000\ue001\ue002\n\t\t\t\t\n";
}
```
required 속성에 대해 default 값으로 true가 되어있는 것을 확인할 수 있다. 그래서 반드시 요청 파라미터가 있어야지만 해당 요청을 정상적으로 처리할 수 있는 것이다.
```java
@Controller
public class EventController {
    @GetMapping("/event")
    @ResponseBody
    public String getParameter(@RequestParam(required = false) String name) {
        return "name : " + name;
    }
}
```
이렇게 required 속성값에 false를 주고 다시 테스트를 해보면 정상적으로 통과된다.
```text
MockHttpServletResponse:
           Status = 200
    Error message = null
          Headers = [Content-Type:"text/plain;charset=UTF-8", Content-Length:"11"]
     Content type = text/plain;charset=UTF-8
             Body = name : null
    Forwarded URL = null
   Redirected URL = null
          Cookies = []
```
또 다른 방법으로 defaultValue 속성을 활용할 수도 있다. default로 값을 지정해줌으로써 요청 파라미터가 없는 경우에도 요청을 처리할 수 있다.
```java
@Controller
public class EventController {
    @GetMapping("/event")
    @ResponseBody
    public String getParameter(@RequestParam(defaultValue = "junsu") String name) {
        return "name : " + name;
    }
}
```
```text
MockHttpServletResponse:
           Status = 200
    Error message = null
          Headers = [Content-Type:"text/plain;charset=UTF-8", Content-Length:"12"]
     Content type = text/plain;charset=UTF-8
             Body = name : junsu
    Forwarded URL = null
   Redirected URL = null
          Cookies = []
```
java 8의 Optional을 활용할 수도 있다. 파라미터를 Optional로 받음으로서 null이 될 수 있음을 명시하는 것이다.
```java
@Controller
public class EventController {
    @GetMapping("/event")
    @ResponseBody
    public String getParameter(@RequestParam Optional<String> name) {
        return "name : " + name.orElseGet(() -> "not provided");
    }
}
```
위와 같이 Optional을 사용해서 요청 파라미터를 받아오게 작성하고 테스트를 진행해보자.
```java
class EventControllerTest {
    @Test
    public void getParameterTest() throws Exception {
        this.mockMvc.perform(get("/event"))
                .andDo(print())
                .andExpect(status().isOk())
        ;
    }
}
```
```text
MockHttpServletResponse:
           Status = 200
    Error message = null
          Headers = [Content-Type:"text/plain;charset=UTF-8", Content-Length:"19"]
     Content type = text/plain;charset=UTF-8
             Body = name : not provided
    Forwarded URL = null
   Redirected URL = null
          Cookies = []
```
결과는 요청 파라미터를 보내지 않았음에도 위와 같이 정상적으로 통과된다.

<br>

참고
<https://www.baeldung.com/spring-request-param>