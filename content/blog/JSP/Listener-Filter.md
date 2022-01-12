---
title: 'Listener, Filter'
date: 2021-01-09 20:10:00
category: 'JSP'
draft: false
---
## 1. Listener

### 1-1. Servlet Listener 란
servlet은 특정 시점에 발생하는 이벤트를 처리하기 위한 인터페이스를 정의하고 있다. 이 인터페이스를 구현하여 이벤트를 처리하는 객체를 Listener라고 한다.

웹에서 이벤트가 사용되는 경우는 아래와 같다.

- 컨텍스트가 초기화 되는 경우
- 세션이 생성되거나 소멸되는 경우
- 속성이 변경되는 경우

### 1-2. Listener interface 종류
(1) ServletContextListener

웹 어플리케이션의 시작과 종료시 자동으로 발생하는 이벤트를 처리하기 위한 메소드를 정의한 인터페이스

- ```java
  void contextInitialized(ServletContextEvent sce) : 웹어플리케이션을 초기화할 때 호출
  ```

- ```java
  void contextDestroyed(ServletContextEvent sce)  : 웹어플리케이션을 종료할 때 호출
  ```
ServletContextEvent 클래스는 getServletContext() 메소드를 제공하는 데, 이 메소드는 콘텍스트를 나타내는 javax.servlet.ServletContext 인스턴스를 리턴해준다.

(2) ServletContextAttributeListener

Servlet Context 속성값들이 변화될 때 발생하는 이벤트를 처리하기 위한 메소드를 정의한 인터페이스

- ```java
  void attributeAdded(ServletContextAttributeEvent scae) : 콘텍스트에 속성이 추가될 때 호출
  ```

- ```java
  void attributeRemoved(ServletContextAttributeEvent scae) : 콘텍스트에서 속성이 삭제될 때 호출
  ```

- ```java
  void attributeReplaceed(ServletContextAttributeEvent scae) : 콘텍스트의 속성값이 변경될 때 호출
  ```
  
(3) HttpSessionListener

HttpSession 객체가 생성되었거나 종료될 때 발생하는 이벤트를 처리하기 위한 메소드를 정의한 인터페이스

- ```java
  void sessionCreated(HttpSessionEvent hse) : session이 생성될 때 호출
  ```

- ```java
  void sessionDestroyed(HttpSessionEvent hse) : session이 종료될 때 호출
  ```

(4) HttpSessionAttributeListener

HttpSession 객체의 속성값들이 변화될 때 발생하는 이벤트를 처리하기 위한 메소드를 정의한 인터페이스

- ```java
  void attributeAdded(HttpSessionBindingEvent  hsbe) : 세션에 새로운 속성값이 추가될 때 호출
  ```

- ```java
  void attributeRemoved(HttpSessionBindingEvent hsbe) : 세션에서 속성값이 삭제될 때 호출
  ```

- ```java
  void attributeReplaced(HttpSessionBindingEvent  hsbe) : 세션의 속성값이 변경될 때 호출
  ```

(5) HttpSessionActivationListener

HttpSession 객체가 다른 JVM으로 마이그레이션될 때 발생하는 이벤트를  처리하기 위한 메소드를 정의한 인터페이스

- ```java
  void sessionDidActivate(HttpSessionEvent e) : 세션이 활성화되었을 때 호출
  ```

- ```java
  void sessionillPassivate(HttpSessionEvent e) : 세션이 비활성화되려고 할 때 호출
  ```

(6) HttpSessionBindingListener

자바 객체가 Session에 추가되거나 삭제될 때 발생하는 이벤트를 처리하기 위한 메소드를 정의한 인터페이스

- ```java
  void valueBound(HttpSessionBindingEvent e) : 객체가 session에 추가될 때 호출
  ```

- ```java
  void valueUnBound(HttpSessionBindingEvent e) : 객체가 session에서 소멸될 때 호출
  ```

해당 인터페이스는 세션에 속성값을 추가, 삭제, 변경하는 경우가 아니라 "구현된 클래스"가 세션에 추가, 삭제되는 경우에 발생한다.(HttpSessionAttributeListener와의 차이점)

(7) ServletRequestListener

ServletRequest 객체가 생성될 때와 소멸될 때(클라이언트의 요청 처리를 마쳤을 때) 발생하는 이벤트를 처리하기 위한 메소드를 정의한 인터페이스

- ```java
  void requestInitialized(ServletRequestEvent sre) : ServletRequest 객체가 생성될 때 호출
  ```

- ```java
  void requestDestroyed(ServletRequestEvent sre) : ServletRequest 객체가 소멸될 때 호출
  ```

(8) ServletRequestAttributeListener

ServletRequest 객체의 속성값들이 변화될 때 발생하는 이벤트를 처리하기 위한 메소드를 정의한 인터페이스

- ```java
  void attributeAdded(ServletRequestAttributeEvent srae) : ServletRequest  객체에 새로운 속성값이 추가될 때 호출
  ```

- ```java
  void attributeRemoved(ServletRequestAttributeEvent srae) : ServletRequest  객체 속성값이 삭제될 때 호출
  ```

- ```java
  void attributeReplaced(ServletRequestAttributeEvent srae) : ServletRequest  객체 속성값이 변경될 때 호출
  ```

### 1-3. Listener 작성법
ServletContextLister 인터페이스를 구현
```java
public class MyContextListener implements ServletContextListener {
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        System.out.println("context Initialized");
    }
    
    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        System.out.println("context Destroyed");
    }
}
```

web.xml 에 등록
```xml
<listener>
    <listener-class>me.junsu.MyContextListener</listener-class>
</listener>
```
## 2. Filter
### 2-1. Servlet Filter 란?
웹 어플리케이션으로 전송되는 Request 혹은 Response 객체를 조작할 수 있도록 설계된 java class이다.

필터는 웹 어플리케이션의 기능 전후에 특정 로직을 수행할 때 사용한다.

필터는 체인으로 동작한다. 체인으로 동작한다는 의미는 필터 1, 필터 2, 필터 3이 있다고 가정했을때, 이때 필터 2는 필터1을 통과해야만 실행됨을 뜻한다.

### 2-2. Filter Interface
javax.servlet.Filter interface를 구현해야 하며, 해당 인터페이스에 정의된 method는 아래와 같다.
- ```java
  void init(FilterConfig filterConfig) : 초기화될 때 호출
  ```

- ```java
  void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
  : 체인을 따라 다음 필터로 이동한다. 체인 마지막에는 클라이언트가 요청한 최종 자원이 존재하게 된다.
  ```

- ```java
  void destroy() : 필터가 삭제될 때 호출
  ```

### 2-3. Filter 작성법
javax.servlet.Filter interface 구현
```java
public class MyFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        System.out.println("Filter init");
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        System.out.println("Filter");
        filterChain.doFilter(servletRequest, servletResponse); //다음 체인으로 넘겨줌
    }

    @Override
    public void destroy() {
        System.out.println("Filter destroy");
    }
}
```

web.xml 등록
```xml
<filter>
    <filter-name>filter</filter-name>
    <filter-class>me.junsu.MyFilter</filter-class>
</filter>

<filter-mapping>
    <filter-name>filter</filter-name>
    <servlet-name>HelloServlet</servlet-name>
</filter-mapping>
```
## 참고

<http://www.wideskills.com/servlets/servlet-listeners>

<http://www.wideskills.com/servlets/servlet-filters>