---
title: 'String(String Constant Pool)'
date: 2021-04-24 11:30:00
category: 'Java'
draft: false
---
자바에서 String 객체를 생성하는 방법에는 2가지가 있다. 
1. String Literal 을 사용해서 생성
2. new 연산자를 사용해서 생성  

위 두가지 방법이 어떻게 다른지 간단한 코드로 확인해보자.
```java
public class StringTest {
    public static void main(String[] args) {
        String str1 = "hi";
        String str2 = "hi";
        //같은 객체임을 의미
        System.out.println("str1 : " + System.identityHashCode(str1));
        System.out.println("str2 : " + System.identityHashCode(str2));
        System.out.println("=======================");
        String str3 = new String("hi");
        String str4 = new String("hi");
        //서로 다른 객체임을 의미
        System.out.println("str3 : " + System.identityHashCode(str3));
        System.out.println("str4 : " + System.identityHashCode(str4));
    }
}
```
```text
출력결과
str1 : 1808253012
str2 : 1808253012
=======================
str3 : 589431969
str4 : 1252169911
=======================
```
identityHashCode() 메서드를 통해 객체의 고유한 hashCode를 비교해보는 코드이다.
str1과 str2는 각각 String literal 방식으로 String 객체를 생성하였고, str3과 str4는 new 연산자를 사용해서 String 객체를 생성하였다.  
출력 결과를 살펴보면 str1과 str2는 HashCode 값이 동일하지만, str3과 str4는 다른 것을 확인할 수 있다. 이는 str1과 str2는 같은 객체이지만, str3과 str4는 다른 객체임을 나타낸다.  

_왜 이런 결과가 나타날 까?_

## String Constant Pool
Heap 영역 내에 String 객체를 별도로 관리하는 String Constant Pool 영역이 있다. String literal 방식으로 객체를 생성하면 해당 String 값은 Heap 영역 내 String Constant Pool에 저장되어 재사용되지만, new 연산자로 생성하면 같은 값일지라도 새로운 객체가 각각의 Heap 영역에 생기게 된다.
그래서 위와 같은 결과가 나타나는 것이다.

이미 str1을 생성하면서 "hi" 라는 값이 String Constant Pool 영역에 존재하게 된다. 그러므로 str2를 생성하면 해당 객체의 값이 String Constant Pool 에 존재하기때문에 해당 reference 를 참조하게 된다.

## intern() 
```java
public class StringTest {
    public static void main(String[] args) {
        String str1 = "hi";
        String str2 = "hi";
        //같은 객체임을 의미
        System.out.println("str1 : " + System.identityHashCode(str1));
        System.out.println("str2 : " + System.identityHashCode(str2));
        System.out.println("=======================");
        String str3 = new String("hi");
        String str4 = new String("hi");
        //서로 다른 객체임을 의미
        System.out.println("str3 : " + System.identityHashCode(str3));
        System.out.println("str4 : " + System.identityHashCode(str4));
        System.out.println("=======================");
        String str5 = str3.intern();
        System.out.println("str5 : " + System.identityHashCode(str5));
    }
}
```
```text
출력결과
str1 : 1808253012
str2 : 1808253012
=======================
str3 : 589431969
str4 : 1252169911
=======================
str5 : 1808253012
```
여기서 주목해야할 부분은 str5의 출력결과이다. str1과 str2와 같은 HashCode 값을 가지는 것을 확인할 수 있다.
이게 바로 intern() 메소드 덕분이다.
intern() 메소드는 해당 String 객체의 값이 String Constant Pool 에 존재한다면 해당 reference 를 리턴해준다.  
str3 객체의 값인 "hi" 는 이미 String Constant Pool 에 존재하므로 해당 reference 를 리턴해주기 때문에 str1과 str2의 값과 동일한 결과가 나타나는 것이다. 

**즉, String 객체를 new 연산자로 생성하는 것은 같은 값일지라도 Heap 영역에 서로 다른 객체를 계속 생성하게 된다. 따라서 불필요한 객체를 계속 생성하게 되므로 String literal 방식으로 객체를 생성해야하고, 이 때 동일한 값의 경우 재사용할 수 있다.** 