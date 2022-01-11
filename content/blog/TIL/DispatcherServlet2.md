---
title: 'DispatcherServlet(2)'
date: 2021-01-14 13:10:00
category: 'TIL'
draft: false
---

## DispatcherServlet 동작원리
- HandlerMapping : Request에 맞는 Handler를 찾아서 매핑해준다.
    - BeanNameUrlHandlerMapping
    - RequestMappingHandlerMapping
    - RouterFunctionMapping
      <br></br>
- HandlerAdapter : Handler를 실행
    - HttpRequestHandlerAdapter
    - SimpleControllerHandlerAdapter
    - RequestMappingHandlerAdapter
    - HandlerFunctionAdapter
      <br></br>
- HandlerExceptionResolver : Exception을 해결하기 위한 전략으로 컨트롤러나 HTML Error view 또는 다른 것으로 매핑해준다.
  <br></br>
- ViewResolver : 컨트롤러에서 리턴된 문자열 기반의 View 이름을 기준으로 실제로 렌더링할 뷰 객체를 결정해준다.
  <br></br>
- LocaleResolver : 국제화된 view를 제공하기위해
  <br></br>
- ThemeResolver : 웹 어플리케이션에서 사용할 수 있는 테마를 결정해준다.
  <br></br>
- MultipartResolver : multipart 요청(file upload) 처리
  <br></br>
- FlashMapManager : 한 요청에서 다른 요청(redirect)으로 속성을 전달하는데 사용할 수 있는 Input, Output 을 FlashMap에 저장하고 검색한다.

참고 : <https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#spring-web>
<br></br>
## 처리순서
1. 클라이언트가 서버에 어떤 요청을 하면 DispatcherServlet(front controller 역할)이 요청을 가로챈다.
2. 요청을 처리할 수 있는 Handler를 찾는다.
3. 등록되어있는 Adapter 중에 해당 Handler를 실행시킬 수 있는 HandlerAdapter를 찾는다.
4. HandlerAdapter를 사용해서 요청을 처리한다.
5. Handler의 returnValue에 따라 View 이름에 해당하는 View를 찾아서 Model 데이터에 넣거나 @ResponseBody가 있다면 컨버터를 통해 응답본문에 넣는다.
6. 예외가 발생한다면 예외 처리 Handler에 요청 처리를 위임해준다.
7. 응답을 보낸다.