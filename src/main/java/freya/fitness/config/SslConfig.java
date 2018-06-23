package freya.fitness.config;

import org.apache.catalina.Context;
import org.apache.catalina.connector.Connector;
import org.apache.tomcat.util.descriptor.web.SecurityCollection;
import org.apache.tomcat.util.descriptor.web.SecurityConstraint;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SslConfig {

  @Value("${server.port:9443}")
  private Integer serverPort;

  @Bean
  public TomcatServletWebServerFactory servletContainer() {
    final TomcatServletWebServerFactory tomcat = new TomcatServletWebServerFactory() {
      @Override
      protected void postProcessContext(final Context context) {
        final SecurityConstraint securityConstraint = new SecurityConstraint();
        securityConstraint.setUserConstraint("CONFIDENTIAL");
        final SecurityCollection collection = new SecurityCollection();
        collection.addPattern("/*");
        securityConstraint.addCollection(collection);
        context.addConstraint(securityConstraint);
      }
    };

    tomcat.addAdditionalTomcatConnectors(initiateHttpConnector());
    return tomcat;
  }

  private Connector initiateHttpConnector() {
    final Connector connector = new Connector("org.apache.coyote.http11.Http11NioProtocol");
    connector.setScheme("http");
    connector.setPort(9000);
    connector.setSecure(false);
    connector.setRedirectPort(serverPort);

    return connector;
  }
}
