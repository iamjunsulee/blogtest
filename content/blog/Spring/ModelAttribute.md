---
title: '@ModelAttribute'
date: 2021-04-27 12:30:00
category: 'Spring'
draft: false
---
@ModelAttribute 어노테이션은 보통 @RequestMapping 을 사용한 핸들러 메소드에서 많이 사용했는데, @Controller 단에서 사용하는 이유와 방법에 대해 알게되어 @ModelAttribute 어노테이션에 대해 간략히 정리해두려고 한다.

## @ModelAttribute 사용하는 방법
1. Handler method
아래의 샘플 코드를 보면 @ModelAttribute 어노테이션으로 Event 객체를 핸들러 메소드의 인수로 사용하고 있다.
```java
@Controller
public class SampleController {
    @PostMapping("/event/create")
    public String createForm(@ModelAttribute Event event, BindingResult bindingResult, Model model) {
        if(bindingResult.hasErrors()) {
            return "/events/form";
        }
        //저장하는 로직
        List<Event> events = new ArrayList<>();
        events.add(event);
        model.addAttribute("events", events);

        return "redirect:/event/list";
    }
}
```
아래의 thymeleaf 로 작성된 코드를 보자. name 과 limitOfEnrollment 필드에 값을 넘겨주고 있다.   
@ModelAttribute 어노테이션으로 인해 아래 view 의 HTTP 요청에 들어있는 속성값들을 Event 객체에 자동적으로 바인딩 하게 된다.
```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Create New Event</title>
</head>
<body>
    <form action="#" th:action="@{/event/create}" th:object="${event}" method="post">
        <input type="text" th:field="*{name}" value="">
        <input type="text" th:field="*{limitOfEnrollment}" value="">
        <button type="submit" >저장</button>
    </form>
</body>
</html>
```

2. @Controller 를 사용한 클래스에서 사용하기  
모든 Handler 메소드에 공통적으로 필요하는 정보일 때는 각 핸들러 메소드에서 모델에 넣어주는 것은 불필요한 반복 작업일 것이다. 
그래서 이런 경우에는 메소드 위에 @ModelAttribute 어노테이션을 사용하여 각 핸들러에 공통적으로 필요한 정보를 모델에 담아준다.

```java
@Controller
public class SampleController {
    @ModelAttribute
    public void categories(Model model) {
        model.addAttribute("categories", List.of("study", "seminar", "social", "hobby"));
    }
}
```
위와 같이 model 에 담아줘도 되고, 아래와 같이 그냥 바로 리턴해도 된다.
```java
@Controller
public class SampleController {
    @ModelAttribute("categories")
    public List<String> categories() {
        return List.of("study", "seminar", "social", "hobby");
    }
}
```
테스트 코드를 작성해서 확인해보면 'categories' 가 Model 에 있는 것을 확인할 수 있다.
```text
ModelAndView:
        View name = /events/list
             View = null
        Attribute = categories
            value = [study, seminar, social, hobby]
```
