---
title: '의존 객체 주입(Dependency Injection)'
date: 2021-04-23 12:07:00
category: 'Java'
draft: false
---
의존 객체 주입이란 말은 아마도 객체지향 프로그래밍(OOP)에서 가장 많이 보는 단어, 개념 중 하나일 것이다.
그렇다면 의존 객체 주입이 뭘까? 왜 사용하는 걸까?

## 의존성에 관한 문제점
아래 코드를 살펴보자.  
Person 클래스의 driving 메서드가 실행되려면 Car 클래스를 필요로 한다.  
즉, Person 클래스는 Car 클래스에 의존적이라는 것이다. 객체지향 프로그래밍의 중요한 특징은 강한 응집력과 약한 결합도를 지향한다는 점인데, 아래와 같은 경우는 Person 클래스와 Car 클래스 사이에 의존성이 있으므로 결합도가 강하다라고 말할 수 있다. 
```java
public class Person {
    public Car car;

    public Person() {
        this.car = new Car();
    }

    public void driving() {
        this.car.drive();
    }
}
```
결합도가 강하면 어떤 문제가 있냐면 Car 클래스를 수정하게 되면 Person 클래스 또한 수정해줘야 한다는 것이다.

## 의존 객체 주입 방식을 사용하는 이유  
- 코드 재활용성을 높여준다.
- 객체 간의 의존성을 줄일 수 있다.
- 좀 더 유연한 코드 작성이 가능해진다.

아래와 같이 Car 클래스가 수정되었다고 치자. 
```java
class Car {
    public void drive() {
        System.out.println("운전");
    }
}

class Bmw extends Car {
    public void drive() {
        System.out.println("BMW타고 운전");
    }
}

class Benz extends Car {
    public void drive() {
        System.out.println("벤츠타고 운전");
    }
}
```
Car 클래스를 상속받는 Bmw 클래스와 Benz 클래스가 생겼다.
이 상황에서 Person 은 Benz 를 탄다라고 가정하자. 그렇다면 아래와 같이 수정이 필요할 것이다. 
```java
public class Person {
    public Car car;

    public Person() {
        this.car = new Benz();  //new Car() -> new Benz() 로 수정
    }

    public void driving() {
        this.car.drive();
    }
}
```
위 코드를 의존 객체 주입 방식을 사용하면 아래와 같다.
```java
public class Person {
    public Car car;

    public Person(Car car) {
        this.car = car;  //의존 객체 주입
    }

    public void driving() {
        this.car.drive();
    }
}
```
내부에서 new 로 구체적인 객체를 생성하는 게 아니라 외부에서 타입을 결정한 후, 그걸 주입한다.
그래서 Car 가 어떤 Car 인지는 알 필요없이 그냥 Car 이면 된다.  
즉, 의존 객체 주입 방식을 사용한다면 Car 의 구현체가 뭐든(Benz 든 Bmw 든) 외부에서 만들어서 넘겨주기만 하면 되기 때문에 Car 클래스를 수정한다고 해서 Person 클래스를 수정할 필요가 없어진다.  