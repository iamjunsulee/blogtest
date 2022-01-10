---
title: '정적 팩토리 메서드(Static Factory Method)'
date: 2021-04-14 11:44:00
category: 'TIL'
draft: false
---
우리가 보통 객체를 생성할 때 public 생성자를 많이 사용한다. 이 방법을 사용해서만 객체를 생성해야하는 것은 아니다. 그렇다면 다른 방법은 뭐가 있을까?
바로 **정적 팩토리 메서드(static factory method)를 사용하는 방법**이다. 

## 정적 팩토리 메서드란?
정적 팩토리 메서드가 무엇일까? 아마 나처럼 모르고 많이 사용한 경우도 있지 않을까 싶다. Enum의 valueOf() 메소드나 LocalDateTime의 of() 메소드 등과 같이 생각보다 은연중에 많이 사용하고 있었다... 반성할 부분이다..모르고 잘 사용했으니..
(잡담이 길었다..)  

**정적 팩토리 메서드는 단순히 말해서 해당 클래스의 인스턴스를 반환하는 정적 메소드이다.** 

간단하게 코드로 살펴보면 아래와 같다. 
```java
public class Test {
    public static void main(String[] args) {
        LocalDateTime localDateTime = LocalDateTime.of(2021, 3, 30, 11, 20);

        System.out.println(localDateTime);
    }
}
```
위와 같이 생성자를 통해서 인스턴스를 생성하는 것이 아니라 of 메소드를 통해서 LocalDateTime 인스턴스를 생성하고 있다. 
해당 메소드를 살펴보면 아래와 같이 LocalDateTime 인스턴스를 반환하는 public static 메소드로 정의되어 있음을 확인할 수 있다. 
```java
public final class LocalDateTime implements Temporal, TemporalAdjuster, ChronoLocalDateTime<LocalDate>, Serializable {
    public static LocalDateTime of(int year, int month, int dayOfMonth, int hour, int minute) {
        LocalDate date = LocalDate.of(year, month, dayOfMonth);
        LocalTime time = LocalTime.of(hour, minute);
        return new LocalDateTime(date, time);
        }
    }
```

## 생성자 vs 정적 팩토리 메서드
객체를 생성함에 있어 생성자라는 방법이 있음에도 정적 팩토리 메서드 방식을 사용하는 이유는 뭘까?  

정적 팩토리 메서드 방식이 생성자 방식에 비해 가지는 장점에 대해 알아보자.

**1. 이름을 가질 수 있다.**  

생성자에 넘기는 매개변수와 생성자 자체만으로는 반환될 객체의 특성을 명확하게 설명하지 못한다.
단순히 생성자로 Order(member, orderItems) 하는 것과 createOrderByMember(member, orderItems) 정적 메소드로 작성한 것 중에 "회원이 작성한 주문" 이라는 뜻을 더 명확하게 전달하는 것은 후자이다.
아래와 같이 매개변수가 다른 생성자가 여럿 필요한 경우에 정적 팩토리 메소드를 활용해서 서로 다른 차이를 나타내는 이름을 지어주면 명확하게 구분하여 사용할 수 있다.
```java
public static Order createOrderByMember(Member member, OrderItem... orderItems) {
    Order order = new Order();
    order.setMember(member);
    for(OrderItem orderItem : orderItems) {
        order.setOrderItems(orderItem);
    }
    return order;
}

public static Order createOrder(OrderItem... orderItems) {
    Order order = new Order();
    for(OrderItem orderItem : orderItems) {
        order.setOrderItems(orderItem);
    }
    return order; 
}
```

**2. 호출될 때마다 인스턴스를 새로 생성하지 않아도 된다.**

```java
public class BigInteger extends Number implements Comparable<BigInteger> {
    public static final BigInteger ZERO = new BigInteger(new int[0], 0);

    /**
     * Initialize static constant array when class is loaded.
     */
    private final static int MAX_CONSTANT = 16;
    private static BigInteger posConst[] = new BigInteger[MAX_CONSTANT+1];
    private static BigInteger negConst[] = new BigInteger[MAX_CONSTANT+1];
    
    public static BigInteger valueOf(long val) {
        // If -MAX_CONSTANT < val < MAX_CONSTANT, return stashed constant
        if (val == 0)
            return ZERO;
        if (val > 0 && val <= MAX_CONSTANT)
            return posConst[(int) val];
        else if (val < 0 && val >= -MAX_CONSTANT)
            return negConst[(int) -val];

        return new BigInteger(val);
    }
}
```
BigInteger 클래스의 valueOf 메소드를 살펴보면 미리 생성해둔 인스턴스를 사용하는 것을 확인할 수 있다. 흔히 쓰는 0 같은 값을 호출시마다 일일이 생성하는 일을 피할 수 있다.

**3. 반환 타입의 하위 타입 객체를 반환할 수 있다.**  
```java
public class Animal {
    public String bark() {
        return "웡웡웡";
    }

    public static Animal getFavoriteAnimal(String type) {
        if(type.equals("고양이")) {
            return new Cat();
        }else {
            return new Tiger();
        }
    }

    public static Animal getAnimal(String type) {
        return new Cat();
    }

    public static Animal getAnimal(String type, String name) {
        return new Tiger();
    }
}

class Tiger extends Animal {
    @Override
    public String bark() {
        return "어흥";
    }
}

class Cat extends Animal {
    @Override
    public String bark() {
        return "야옹";
    }
}
```
위와 같은 Animal 클래스를 상속받는 Tiger, Cat 클래스가 있다고 하자.
Animal 인스턴스를 생성하는 정적 팩토리 메소드를 통해 Animal 클래스가 아니라 하위 타입인 Cat 클래스 객체를 생성할 수 있다. 
```text
Animal cat = Animal.getFavoriteAnimal("고양이");
System.out.println(cat.bark()); -> 출력결과 : 야옹
```
생성자는 리턴 값을 가질 수 없기 때문에 자기 자신만 반환할 수 있지만 정적 팩토리 메서드를 사용하면 하위 타입을 반환할 수 있게 된다.
즉, 반환할 객체의 클래스를 자유롭게 선택할 수 있는 유연성을 제공한다.

**4. 매개변수에 따라 다른 클래스의 객체를 반환할 수 있다.**  

위에서 getAnimal() 메소드를 보자. 매개변수에 따라 Cat 클래스의 객체 혹은 Tiger 클래스의 객체를 생성할 수 있다.
즉, 하위 타입이기만 하면 어떤 클래스의 객체를 반환하든 상관없다.

**5. 정적 팩토리 메서드를 작성하는 시점에는 반환할 객체의 클래스가 존재하지 않아도 된다.**

참고  
Effective Java 3/E
