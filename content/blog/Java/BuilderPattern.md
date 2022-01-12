---
title: 'Builder Pattern'
date: 2021-04-19 11:29:00
category: 'Java'
draft: false
---
정적 팩토리 메서드와 생성자 모두 매개변수가 많을 경우 적절히 대처하기 어렵다. 

### 점층적 생성자 패턴
점층적 생성자 패턴이란 필수 매개변수만 받는 생성자, 필수 매개변수와 선택 매개변수 1개를 받는 생성자, 선택 매개변수를 2개까지 받는 생성자, ..형태로 선택 매개변수를 전부 다 받는 생성자까지 늘려가는 방식이다.

```java
public class Person {
    private String name;
    private int age;
    private String phone;
    
    public Person() { }
    
    public Person(String name) {
        this.name = name;
    }
    
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public Person(String name, int age, String phone) {
        this.name = name;
        this.age = age;
        this.phone = phone;
    }
}
```
위 코드를 보면 문제가 없어보인다. 하지만 멤버 변수가 3개가 아니라 수십 개라고 생각해보자. 일일히 다 만들어주는 것도 번거롭지만 내가 원치않는 매개변수에 값을 할당해야하는 경우도 생길지도 모른다.
매개변수가 많아지면 많아질수록 코드도 점점 복잡해질 것이다.

### 자바 빈즈 패턴(Java Beans Pattern)
매개변수 없는 생성자로 객체를 만든 후, Setter 메서드를 통해서 원하는 매개변수 값을 설정하는 방식이다.

```java
@Setter
public class Person {
    private String name;
    private int age;
    private String phone;

    public Person() { }
}
```
```text
Person person = new Person();
person.setName("leejunsu");
person.setAge(32);
person.setPhone("01012341234");
```
점층적 생성자 패턴에 비해서 인스턴스를 만들기 쉽고, 알아보기 쉽다.
_하지만 객체 하나를 생성하기 위해서 Setter 메서드를 여러 개 호출해야 하고, 객체가 완전히 완성되기 전까진 Setter 메서드를 통해 객체가 변할 수 있기 때문에 일관성 유지가 어렵다._

### 빌더 패턴
점층적 생성자 패턴과 자바 빈즈 패턴을 골고루 섞어놓은 듯한 방식이다.  
필수 매개변수를 가지는 생성자를 호출한 후, Setter 메서드를 호출해서 선택 매개변수를 추가한다.
```java
public class Pizza {
    private final String topping;
    private final String source;
    private final String dough;
    private final String size;

    public static class Builder {
        //필수 매개변수
        private String topping = "";
        private String size = "";
        //선택 매개변수
        private String source = "tomato";
        private String dough = "crust";

        public Builder(String topping, String size) {
            this.topping = topping;
            this.size = size;
        }

        public Builder setSource(String source) {
            this.source = source;
            return this;
        }

        public Builder setDough(String dough) {
            this.dough = dough;
            return this;
        }

        public Pizza build() {
            return new Pizza(this);
        }
    }

    public Pizza(Builder builder) {
        this.topping = builder.topping;
        this.size = builder.size;
        this.source = builder.source;
        this.dough = builder.dough;
    }

    @Override
    public String toString() {
        return "Pizza{" +
                "topping='" + topping + '\'' +
                ", source='" + source + '\'' +
                ", dough='" + dough + '\'' +
                ", size='" + size + '\'' +
                '}';
    }

    public static void main(String[] args) {
        Pizza pizza = new Pizza
                .Builder("cheese", "L")
                .setDough("thin")
                .setSource("cream")
                .build();

        System.out.println(pizza.toString());
    }
}
```
객체를 생성하는 코드를 보면 필수 매개변수만으로 생성자를 호출하여 객체를 얻은 후, Setter 메소드를 통해 선택 매개변수를 설정하고, 마지막으로 build 메소드를 통해 객체를 완성한다.  
점층적 생성자 패턴처럼 안정성있으며, 자바 빈즈 패턴처럼 가독성 있다. 단, Builder 클래스를 작성해야 하는 점이 번거로울 뿐이다. 
이 문제는 Lombok 라이브러리를 사용하면 쉽게 해결할 수 있다. 
```java
@Builder
@Setter
@RequiredArgsConstructor
public class Pizza {
    private final String topping;
    private final String source;
    private final String dough;
    private final String size;
    @Override
    public String toString() {
        return "Pizza{" +
                "topping='" + topping + '\'' +
                ", source='" + source + '\'' +
                ", dough='" + dough + '\'' +
                ", size='" + size + '\'' +
                '}';
    }

    public static void main(String[] args) {
        Pizza pizza = Pizza.builder()
                .topping("cheese")
                .size("Large")
                .dough("thin")
                .source("cream")
                .build();

        System.out.println(pizza.toString());
    }
}
```
```text
Pizza{topping='cheese', source='cream', dough='thin', size='Large'}
```
@Builder 어노테이션을 붙이는 것만으로 Builder 클래스를 직접 작성할 필요가 없어졌다. 

Effective Java 책에서는 객체 생성시 필요한 인자가 4개 이상은 될 때 쓰면 좋을 것 같다고 말하고 있다.
개발을 진행하다보면 점점 매개변수가 많아지는 경향이 있으므로 처음부터 빌더 패턴을 적용시켜도 괜찮을 것 같다.