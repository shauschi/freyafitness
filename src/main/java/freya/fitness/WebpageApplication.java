package freya.fitness;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@SpringBootApplication
@EnableOAuth2Sso
public class WebpageApplication extends WebSecurityConfigurerAdapter {

  public static void main(String[] args) {
    SpringApplication.run(WebpageApplication.class, args);
  }

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http
        .cors().and()
        .antMatcher("/**")
        .authorizeRequests()
          .antMatchers("/login**", "/webjars/**")
          .permitAll()
        .anyRequest()
          .authenticated()
        .and().logout().logoutSuccessUrl("/").permitAll();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(
        "http://127.0.0.1:3333", "http://localhost:3333",
        "http://127.0.0.1:9000", "http://localhost:9000"));
    configuration.setAllowedMethods(Arrays.asList("GET","POST"));
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }
}
