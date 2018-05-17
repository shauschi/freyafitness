package freya.fitness.service;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.mockito.Mockito.verify;

@RunWith(MockitoJUnitRunner.class)
public class EmailServiceTest {

  @InjectMocks
  private EmailService testee;

  @Mock
  private JavaMailSender javaMailSender;

  @Test
  public void test_sendMail_usesJavaMailSender() {
    SimpleMailMessage email = new SimpleMailMessage();

    testee.sendMail(email);

    verify(javaMailSender).send(email);
  }

}