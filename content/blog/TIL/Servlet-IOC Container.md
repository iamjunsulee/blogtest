---
title: 'Servlet에서 IOC Container 사용하는 법'
date: 2021-01-10 14:10:00
category: 'TIL'
draft: false
---
Spring Framework 기반의 어플리케이션에선 bean 객체를 갖고 오기 위해 GenericApplicationContext 설정을 참조한다. 그렇게 생성된 context 객체의 getBean 메소드를 통해 원하는 bean 객체를 참조할 수 있다.

bean 객체를 갖고 오기 위해 어떻게 context 객체를 참조해야 할까?

web.xml에 Listener를 등록해준다.

```xml
<listener>
	<listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
</listener>
```

- ContextLoaderListener
ContextLoaderListener는 org.springframework.web.context.ContextLoader 클래스를 상속받아 ServletContextListener 인터페이스를 구현한 클래스이다.
ServletApplication의 생명주기에 맞춰서 Spring IOC Container 즉, ApplicationContext를 WebApplication에 등록된 Servlet들이 사용할 수 있도록 ServletContext에 등록해주고, Servlet이 종료될 시점에 삭제해주는 일을 한다.



ServletContextListener interface의 contextInitialized 메소드를 구현한 것을 보면 아래와 같은데, ContextLoader의 initWebApplicationContext 메소드를 실행하는 것을 알 수 있다.
```java
public void contextInitialized(ServletContextEvent event) {
	this.initWebApplicationContext(event.getServletContext());
}
```



initWebApplicationContext 메소드 안에서 configureAndRefreshWebApplicationContext 메소드를 따라가보면 아래처럼 contextConfigLocation parameter를 가지고 config함을 알 수 있다.
그래서 web.xml에 context-param을 설정해주는 것이다. 

```java
configLocationParam = sc.getInitParameter("contextConfigLocation");
if (configLocationParam != null) {
	wac.setConfigLocation(configLocationParam);
}
```



아래와 같이 설정하면 me.junsu.AppConfig에 있는 bean 설정 정보를 참조해서 ApplicationContext를 생성한다.

```xml
<context-param>
	<param-name>contextConfigLocation</param-name>
	<param-value>me.junsu.AppConfig</param-value>
</context-param>
```



생성된 ApplicationContext를 servletContext의 WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE 속성에 넣어주는 것을 확인할 수 있다.

```java
servletContext.setAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE, this.context);
```


그럼 이제 Servlet에서 해당 속성값을 받아와서 getBean 메소드를 사용해서 bean 객체를 사용할 수 있다. 

```java
ApplicationContext applicationContext = (ApplicationContext) getServletContext().getAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE);
HelloService helloService = applicationContext.getBean(HelloService.class);
```