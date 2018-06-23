package freya.fitness.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class MailConfig {

  @Bean
  public JavaMailSender getJavaMailSender(
      @Value("${MAIL_HOST:localhost}") final String host,
      @Value("${MAIL_PORT:1124}") final Integer port,
      @Value("${MAIL_USR:todo}") final String username,
      @Value("${MAIL_PSW:todo}") final String password) {
    final JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
    mailSender.setHost(host);
    mailSender.setPort(port);
    mailSender.setUsername(username);
    mailSender.setPassword(password);

    final Properties props = mailSender.getJavaMailProperties();
    props.put("mail.transport.protocol", "smtp");
    props.put("mail.smtp.auth", "true");
    props.put("mail.smtp.starttls.enable", "true");
    props.put("mail.debug", "true");

    mailSender.setJavaMailProperties(props);

    return mailSender;
  }

}
