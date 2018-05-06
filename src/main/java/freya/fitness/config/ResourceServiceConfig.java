package freya.fitness.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;

@Configuration
@EnableResourceServer
public class ResourceServiceConfig extends ResourceServerConfigurerAdapter {

  private final AppConfig appConfig;

  @Autowired
  public ResourceServiceConfig(final AppConfig appConfig) {
    this.appConfig = appConfig;
  }

  @Override
  public void configure(final HttpSecurity http) throws Exception {
    appConfig.configure(http);
  }

}
