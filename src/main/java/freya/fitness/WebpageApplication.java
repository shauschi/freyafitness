package freya.fitness;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;

@SpringBootApplication
@EnableResourceServer
public class WebpageApplication extends SpringBootServletInitializer { //extends WebSecurityConfigurerAdapter {

  public static void main(String[] args) {
    SpringApplication.run(WebpageApplication.class, args);
  }
/*
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http
        .cors().and()
        .antMatcher("/**")
        .authorizeRequests()
          .antMatchers("/", "/login**", "/logout**", "/news/**", "/webjars/**", "/*.png", "/bundle.min.js")
          .permitAll()
        .anyRequest()
          .authenticated()
        .and().logout().logoutSuccessUrl("/").permitAll()
        .and().csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
  }
  /*

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowCredentials(true);
    configuration.setAllowedOrigins(Arrays.asList(
        "http://127.0.0.1:3333", "http://localhost:3333",
        "http://127.0.0.1:9000", "http://localhost:9000"));
    configuration.addAllowedHeader("*");
    configuration.setAllowedMethods(Arrays.asList(
        HttpMethod.HEAD.name(),
        HttpMethod.OPTIONS.name(),
        HttpMethod.GET.name(),
        HttpMethod.PUT.name(),
        HttpMethod.POST.name()));
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }
  */
}
