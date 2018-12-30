package freya.fitness;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients
@EnableZuulProxy
@SpringBootApplication
public class WebpageApplication {

  public static void main(String[] args) {
    SpringApplication.run(WebpageApplication.class, args);
  }

}
