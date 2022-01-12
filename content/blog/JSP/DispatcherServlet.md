---
title: 'DispatcherServlet(1)'
date: 2021-01-13 11:30:00
category: 'JSP'
draft: false
---
## Front Controller 패턴

사용자의 요청을 서블릿에 전달하기 위해서는 아래와 같이 web.xml에 서블릿을 등록하고 매핑하는 작업을 해야한다.

```xml
<servlet>
	<servlet-name>sampleServlet</servlet-name>
	<servlet-class>me.junsu.SampleServlet</servlet-class>
</servlet>

<servlet-mapping>
	<servlet-name>sampleServlet</servlet-name>
	<url-pattern>/hello</url-pattern>
</servlet-mapping>
```
요청이 늘어나면 web.xml에 등록해야할 서블릿과 매핑 정보 또한 늘어날 것이다. 
이런 문제를 해결해주는 디자인 패턴이 바로 _Front Controller 패턴_이다. 
모든 요청에 대해 하나의 서블릿이 다 받아서 다른 컨트롤러로 위임시켜준다. 

## DispatcherServlet이란
Spring MVC에서는 Front Controller 역할을 하는 서블릿을 만들어놓았다. 그게 바로 DispatcherServlet이다.
간단하게 말하자면 모든 요청을 받아 실질적인 요청을 처리할 controller를 매핑하고 해당 요청 처리 결과를 Http Response 만드는 역할을 한다.
//TO-DO DispatcherServlet에 대해 자세하게 정리할 필요가 있음. 



## Context Hierarchy

![mvc-hierarchy](./images/mvc-context-hierarchy.png)

> The root `WebApplicationContext` typically contains infrastructure beans, such as data repositories and business services that need to be shared across multiple `Servlet` instances. Those beans are effectively inherited and can be overridden (that is, re-declared) in the Servlet-specific child `WebApplicationContext`, which typically contains beans local to the given `Servlet`.
출처 : https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#spring-web

DispatcherServlet은 일반적으로 계층 구조를 가진다. (보통 단일 DispatcherServlet, 단일 WebApplicationContext를 갖는 구조로 간단하게도 만들기도 한다.)
Root WebApplicationContext는 일반적으로 여러 개의 Servlet 인스턴스에서 공유해야 하는 데이터 저장소 및 비즈니스 서비스와 같은 인프라 bean을 포함한다.
이러한 bean은 효과적으로 상속되며 서블릿 특정 클래스에서 재정의될 수 있다.
Servlet WebApplicationContext는 일반적으로 주어진 지역의 빈을 포함한다.

즉, ContextLoaderListener에 의해 ServletContext에 등록되는 ApplicationContext가 바로 Root WebApplicationContext이고,
DIspatcheServlet에서 Root WebApplicationContext를 상속받아 만든 ApplicationContext가 Servlet WebApplicationContext인 것이다.



## DispatcherServlet 등록
web.xml 아래와 같이 등록한다.

```xml
<listener>
	<listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
</listener>

<context-param>
	<param-name>contextConfigLocation</param-name>
	<param-value>/WEB-INF/app-context.xml</param-value>
</context-param>

<servlet>
	<servlet-name>app</servlet-name>
	<servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
	<init-param>
		<param-name>contextConfigLocation</param-name>
		<param-value></param-value>
	</init-param>
	<load-on-startup>1</load-on-startup>
</servlet>

<servlet-mapping>
	<servlet-name>app</servlet-name>
	<url-pattern>/app/*</url-pattern>
</servlet-mapping>
```
