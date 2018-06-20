package freya.fitness.config;

import freya.fitness.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

  private final UserService userService;
  private final AppConfig appConfig;

  @Autowired
  public WebSecurityConfig(final UserService userService, final AppConfig appConfig) {
    this.userService = userService;
    this.appConfig = appConfig;
  }

  @Override
  protected void configure(final HttpSecurity http) throws Exception {
    appConfig.configure(http);
  }

  @Override
  protected void configure(final AuthenticationManagerBuilder auth) throws Exception {
    auth.userDetailsService(userService);
  }

  @Override
  @Bean
  public AuthenticationManager authenticationManagerBean() throws Exception {
    return super.authenticationManagerBean();
  }

  @Bean
  public FilterRegistrationBean simpleCorsFilter() {
    final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    final CorsConfiguration config = new CorsConfiguration();
    config.setAllowCredentials(true);
    config.setAllowedOrigins(Arrays.asList(
        "http://freya.fitness",
        "http://www.freya.fitness",
        "http://127.0.0.1:3333",
        "http://localhost:3333",
        "http://127.0.0.1:9000",
        "http://localhost:9000"));
    config.setAllowedHeaders(Collections.singletonList("*"));
    config.setAllowedMethods(Arrays.asList(
        HttpMethod.HEAD.name(),
        HttpMethod.OPTIONS.name(),
        HttpMethod.GET.name(),
        HttpMethod.PUT.name(),
        HttpMethod.POST.name()));
    source.registerCorsConfiguration("/**", config);
    final FilterRegistrationBean<CorsFilter> bean =
        new FilterRegistrationBean<>(new CorsFilter(source));
    bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
    return bean;
  }
}
