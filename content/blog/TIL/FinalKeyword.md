---
title: 'final이란'
date: 2021-04-27 12:07:00
category: 'TIL'
draft: false
---

## final 키워드
final 키워드를 간단하게 상수로만 생각하고 있어서 다시 정확하게 파악하고, 기억하기 위해서 정리해보려고 한다.  
final 키워드는 변수, 메서드, 클래스에 적용이 가능하다. 

1. 변수
```java
public class Parent {
    private final int age = 1;

    public static void main(String[] args) {
        Parent parent = new Parent();
        parent.age = 64; //compile error
    }
}
```
선언과 동시에 1로 초기화하였다. 한번 할당이 되면 다시 값을 변경할 수 없다. 선언과 동시에 초기화하지 않으면 마찬가지로 에러가 발생한다.
```java
public class Parent {
    private final int age;

    public Parent(int age) {
        this.age = age;
    }

    public static void main(String[] args) {
        Parent parent = new Parent(1);
        parent.age = 64;
    }
}
```
선언과 동시에 초기화하지 않는 경우, 인수로 받는 생성자를 생성해야만 한다.  
참조(reference) 타입의 변수에 final 키워드를 적용시켜보자.
```java
public class Parent {
    private final int age = 1;
    private String name;

    public static void main(String[] args) {
        final Parent parent = new Parent();
        //parent = new Parent();    //compile error
        parent.name = "leejunsu";
    }
}
```
객체 변수를 final 로 선언하면 해당 변수에 다른 참조 값을 할당할 수 없다. 즉, 한 번 할당하면 바꿀 수 없다. 단, 객체가 가지는 필드의 값을 변경하지 못하는 것은 아니다.

2. 메서드  
메서드를 final 로 선언하면 상속받은 클래스에서 오버라이딩을 할 수 없다. 무조건 상속받아 그대로 사용해야 하는 메서드의 경우에만 final 키워드를 적용해야 한다.
```java
public class Parent {
    private final int age = 1;
    private String name;

    public final void print() {
        System.out.println("hahaha");
    }
}

class Child extends Parent {
    public void print() {   //compile error
        System.out.println("hohoho");
    }
}
```

3. 클래스  
클래스를 final 로 선언하면 해당 클래스를 상속받을 수 없다.
```java
public final class Parent {
    private final int age = 1;
    private String name;
}

class Child extends Parent {    //compile error
}
```

정리하자면 final 키워드는 변수나 메서드 또는 클래스가 **변경 불가능**하도록 만든다.  
- 원시 타입의 변수에 적용 시, 해당 변수의 값은 바꿀 수 없다. 
- 참조 변수에 적용 시, Heap 영역 내 다른 객체를 가리키도록 변경할 수 없다.
- 메서드에 적용 시, 오버라이딩 할 수 없다.
- 클래스에 적용 시, 해당 클래스를 상속받을 수 없다.  