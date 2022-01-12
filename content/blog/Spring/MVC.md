---
title: 'MVC'
date: 2021-01-08 17:30:00
category: 'Spring'
draft: false
---
## MVC 패턴이란
모델-뷰-컨트롤러는 소프트웨어공학에서 사용되는 아키텍쳐 패턴으로 Business logic과 Presentation logic을 분리하기 위해 사용한다.

```
Model(M) : 도메인 객체 또는 DTO로 화면에 전달할 또는 화면에서 전달 받은 데이터를 담고 있는 객체
View(V) : 데이터를 보여주는 역할
Controller(C) : 사용자의 요청을 받아 모델 객체의 데이터를 변경하거나 모델 객체를 뷰에 전달해주는 역할
```

## Spring MVC 요청 처리 과정
1. 클라이언트의 요청이 Dispatcher Servlet에게 전달된다.
2. DIspatcheServlet은 HandlerMapping을 통해 클라이언트의 요청을 처리할 Controller를 찾는다.
3. DispatcherServlet은 Controller 객체를 이용하여 클라이언트의 요청을 처리한다.
4. Controller는 클라이언트 요청 처리 결과와 View페이지 정보를 담은 ModelAndView 객체를 반환한다.
5. DispatcherServlet은 ViewResolver로부터 응답 결과를 생성할 View 객체를 구한다.
6. View는 클라이언트에게 전송할 응답을 생성한다.

## MVC 패턴의 장점
- 백엔드 개발자/프론트엔드 개발자/디자이너의 협업이 용이하다.
- 높은 결합도(논리적으로 관련있는 기능을 하나의 컨트롤러로 묶거나, 특정 모델과 관련있는 뷰를 그룹화 할 수 있다.)

