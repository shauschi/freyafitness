package freya.fitness.config;

import freya.fitness.api.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerSecurityConfigurer;

@Configuration
@EnableAuthorizationServer
public class AuthServerConfig extends AuthorizationServerConfigurerAdapter {

  private final int DAY = 24 * 60 * 60; // in seconds

  private final AuthenticationManager authenticationManager;
  private final AppConfig appConfig;
  private final PasswordEncoder passwordEncoder;
  private final UserService userService;

  @Autowired
  public AuthServerConfig(
      @Qualifier("authenticationManagerBean")
      final AuthenticationManager authenticationManager,
      final AppConfig appConfig,
      final PasswordEncoder passwordEncoder,
      final UserService userService) {
    this.authenticationManager = authenticationManager;
    this.appConfig = appConfig;
    this.passwordEncoder = passwordEncoder;
    this.userService = userService;
  }

  @Override
  public void configure(final ClientDetailsServiceConfigurer clients) throws Exception {
    clients.inMemory()
        .withClient("freyaFitnessWebApp")
        .secret(passwordEncoder.encode("secret"))
        .accessTokenValiditySeconds(30 * DAY)
        .refreshTokenValiditySeconds(360 * DAY)
        .authorizedGrantTypes("password", "authorization_code", "refresh_token")
        .scopes("read", "write");
  }

  @Override
  public void configure(final AuthorizationServerSecurityConfigurer oauthServer) {
    oauthServer
        .tokenKeyAccess("permitAll()")
        .checkTokenAccess("isAuthenticated()");
  }

  @Override
  public void configure(final AuthorizationServerEndpointsConfigurer endpoints) {
    endpoints
        .tokenStore(appConfig.tokenStore())
        .authenticationManager(authenticationManager)
        .userDetailsService(userService);
  }
}
