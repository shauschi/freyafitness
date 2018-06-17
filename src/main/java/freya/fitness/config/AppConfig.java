package freya.fitness.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.JdbcTokenStore;

import javax.sql.DataSource;

@Configuration
public class AppConfig {

  @Value("${spring.datasource.driverClassName:org.postgresql.Driver}")
  private String driverClassName;

  @Value("${DB_URL:jdbc:postgresql://localhost/freyafitness}")
  private String dataSourceUrl;

  @Value("${DB_URS:postgres}")
  private String dataSourceUsername;

  @Value("${DB_PSW:postgres}")
  private String dataSourcePassword;

  @Bean
  public DataSource dataSource() {
    final DriverManagerDataSource dataSource = new DriverManagerDataSource();
    dataSource.setDriverClassName(driverClassName);
    dataSource.setUrl(dataSourceUrl);
    dataSource.setUsername(dataSourceUsername);
    dataSource.setPassword(dataSourcePassword);
    return dataSource;
  }

  @Bean
  public TokenStore tokenStore() {
    return new JdbcTokenStore(dataSource());
  }

  public void configure(final HttpSecurity http) throws Exception {
    http
        .cors()
      .and()
        .csrf().disable()
        .antMatcher("/**")
        .authorizeRequests()
        .antMatchers("/", "/profile/create",
            "/news/previews",
            "/courses/from/**",
            "/coursetypes/",
            "/*.jpg")
        .permitAll()
        .anyRequest()
        .authenticated();
  }

}
