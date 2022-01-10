---
title: 'private 생성자'
date: 2021-04-21 12:48:00
category: 'TIL'
draft: false
---
## 인스턴스화를 막으려거든 private 생성자를 사용하라
java.lang.Math와 java.util.Arrays처럼 정적 필드와 정적 메서드만을 담은 클래스를 만들고 싶은 경우, private 생성자를 사용해야 한다.
```java
public final class Math {
    //Don't let anyone instantiate this class.
    private Math() {}
    public static final double E = 2.7182818284590452354;
    public static final double PI = 3.14159265358979323846;
}
```
Math 클래스를 살펴보면 private 생성자를 사용하고 위에 주석으로 인스턴스화를 막기 위해 사용한다고 적혀있음을 알 수 있다.

_왜 private 생성자를 사용해야 할까?_

생성자를 명시하지 않으면 컴파일러가 매개변수가 없는 public 생성자를 만들기 때문이다. 그렇다고 추상 클래스로 만드는 것도 인스턴스화를 막을 수 없다. 하위 클래스를 만들어 인스턴스화하면 된다.  

그래서 **private 생성자를 사용해서 인스턴스화를 막는 것이다.**  
private 생성자이므로 클래스 바깥에서 접근할 수 없으며 상속 또한 불가능하게 한다. 왜냐하면 상속은 상위 클래스의 생성자를 호출하는데, private으로 선언했으니 하위 클래스가 접근할 수가 없다.
