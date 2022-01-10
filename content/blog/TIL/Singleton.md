---
title: '싱글턴 패턴'
date: 2021-04-21 12:38:00
category: 'TIL'
draft: false
---
## private 생성자나 열거 타입으로 싱글턴임을 보증하라

### 싱글턴이란
인스턴스를 오직 하나만 생성할 수 있는 클래스
하나의 인스턴스만 생성하므로 모든 클라이언트에게 동일한 인스턴스를 반환하게 된다.

### 싱글턴을 만드는 방법
인스턴스를 생성함에 있어 보통 new 메서드를 많이 사용한다. 그렇다면 인스턴스를 오직 하나만 생성하려면 어떻게 해야할까?  
**인스턴스를 생성에 제약을 걸어야한다. 생성자를 외부에서 사용하지 못하도록 private 접근 제어자를 지정하고, 유일한 인스턴스를 반환하도록 정적 메서드를 제공해야 한다.**
```java
public class Singleton {
    private static final Singleton instance = new Singleton();
    private Singleton() { }
    public static Singleton getInstance() {
        return instance;
    }
}
```
정적 메소드 대신에 static final 멤버 변수를 public 으로 지정하여 사용하는 방법도 있다.
```java
public class Singleton {
    public static final Singleton instance = new Singleton();
    private Singleton() { }
}
```
정적 메소드를 생성할 필요가 없으며, 직관적이다. private 생성자로 인해 외부에서 인스턴스를 생성할 수 없고, static final 멤버 변수를 사용함으로써 최초 초기화 이후 다시 초기화할 수 없으며 메모리 영역에서 공유하는 유일한 객체를 만들 수 있다.