---
title: 'WebMvcConfigurer Formatter 설정하기'
date: 2021-01-27 11:30:00
category: 'Spring'
draft: false
---
```java
@RestController
public class HelloController {
    @GetMapping("/hello/{name}")
    public String getHello(@PathVariable("name") Person person) {
        return "hello " + person.getName();
    }
}
```
위와 같이 /hello 요청 뒤에 넘어오는 변수 값을 hello 문자와 합쳐 출력하는 간단한 컨트롤러가 있다고 하자. 
_이 컨트롤러를 아래와 같이 테스트하는 경우 과연 어떻게 될까?_
```java
@ExtendWith(SpringExtension.class)
@WebMvcTest(HelloController.class)
class HelloControllerTest {
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    public void getHelloWithPathVariableTest() {
        this.mockMvc.perform(get("/hello/junsu"))
                .andDo(print())
                .andExpect(content().string("hello junsu"));
    }
}
```
테스트 결과는 실패이다. 왜일까?  
컨트롤러 코드를 보면 Url 요청으로 넘어온 변수 name을 Person 객체로 받고 있다. 그러나 Person 객체로 인식하지 못하기 때문에 테스트가 실패하는 것이다.
여기서 필요한 게 바로 **Formatter 클래스**이다.  

Url 요청으로 넘어온 변수를 Person 객체로 변경해주는 Formatter 클래스를 작성한다.
```java
public class PersonFormatter implements Formatter<Person> {
    @Override
    public Person parse(String s, Locale locale) throws ParseException {
        Person person = new Person();
        person.setName(s);
        return person;
    }

    @Override
    public String print(Person person, Locale locale) {
        return null;
    }
}
```
parse()와 print()를 구현해 줘야 한다. parse 메소드를 살펴보면 넘어온 String 값을 가지는 Person 객체를 생성해서 리턴하고 있다.  

다음으로 MVC 설정을 커스터마이징하기 위해 WebMvcConfigurer 인터페이스를 구현한 클래스를 작성한다.
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addFormatter(new PersonFormatter());
    }
}
```
여기서 addFormatters 메소드를 위와 같이 구현한다. 그럼 위에서 작성했던 PersonFormatter를 Formatter로 인식하게 되고 Url 요청으로 넘어온 변수를 가지는 Person 객체로 변환해줌으로 테스트가 정상적으로 동작하게 된다.  
![mockResponse](/Spring/image/mockResponse.PNG)

WebMvcConfigurer 인터페이스를 구현한 클래스를 작성하지 않고 손쉽게 사용하는 방법도 있다.
SpringBoot AutoConfiguration 관련해서 WebMvcAutoConfiguration 클래스를 살펴보면 addFormatters 메소드는 아래와 같이 작성되어있다.
```java
public class WebMvcAutoConfiguration {
    public void addFormatters(FormatterRegistry registry) {
        ApplicationConversionService.addBeans(registry, this.beanFactory);
    }
}
```
```java
public class ApplicationConversionService extends FormattingConversionService {
    public static void addBeans(FormatterRegistry registry, ListableBeanFactory beanFactory) {
        Set<Object> beans = new LinkedHashSet();
        beans.addAll(beanFactory.getBeansOfType(GenericConverter.class).values());
        beans.addAll(beanFactory.getBeansOfType(Converter.class).values());
        beans.addAll(beanFactory.getBeansOfType(Printer.class).values());
        beans.addAll(beanFactory.getBeansOfType(Parser.class).values());
        Iterator var3 = beans.iterator();

        while (var3.hasNext()) {
            Object bean = var3.next();
            if (bean instanceof GenericConverter) {
                registry.addConverter((GenericConverter) bean);
            } else if (bean instanceof Converter) {
                registry.addConverter((Converter) bean);
            } else if (bean instanceof Formatter) {
                registry.addFormatter((Formatter) bean);
            } else if (bean instanceof Printer) {
                registry.addPrinter((Printer) bean);
            } else if (bean instanceof Parser) {
                registry.addParser((Parser) bean);
            }
        }
    }
}
```
ApplicationConversionService의 addBeans 메소드를 살펴보면 빈 타입이 Formatter 인 경우, addFormater 메소드를 통해 Formatter로 등록해주고 있다.   
**따라서 Config 클래스를 따로 생성해서 addFormatters 메소드를 구현할 필요 없이 내가 작성한 Formatter 클래스를 빈으로 등록만 해주면 된다.**
```java
@Component
public class PersonFormatter implements Formatter<Person> {
    @Override
    public Person parse(String s, Locale locale) throws ParseException {
        Person person = new Person();
        person.setName(s);
        return person;
    }

    @Override
    public String print(Person person, Locale locale) {
        return null;
    }
}
```
@Component 어노테이션을 사용해서 빈으로 등록해준다. 단, 이렇게 한 경우 내가 작성한 테스트에선 실패라는 결과가 나오게 된다. 이는 @WebMvcTest 어노테이션 때문인데 이 어노테이션은 WebMvc 테스트만을 위한 어노테이션이다보니 해당 PersonFormatter 클래스를 빈으로 등록안해서 그렇다.
```text
@WebMvcTest({PersonFormatter.class, SampleController.class})
```
이렇게 해당 클래스를 명시해주면 문제없이 테스트가 잘 동작한다.