package freya.fitness.service;

import freya.fitness.api.dto.ContactDto;
import freya.fitness.proxy.EmailProxy;
import freya.fitness.utils.exception.MailTemplateNotFoundException;
import freya.fitness.utils.exception.ResourceLoadingException;
import javax.mail.MessagingException;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.test.util.ReflectionTestUtils;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class ContactServiceTest {

  @InjectMocks
  private ContactService testee;

  @Mock
  private EmailProxy emailProxy;

  @Rule
  public ExpectedException expectedException = ExpectedException.none();

  @Before
  public void setUp() {
    ReflectionTestUtils.setField(testee, "emailTo", "testee@mail.com");
  }

  @Test
  public void shouldSendFormattedMail() {
    // given
    final ContactDto contactRequest = new ContactDto();
    contactRequest.setFirstname("Max");
    contactRequest.setLastname("Muster");
    contactRequest.setEmail("request@mail.com");
    contactRequest.setTelephone("0049 123 456789");
    contactRequest.setSubject("Hello World");
    contactRequest.setMessage("Fancy message\n\nwith line break.");

    // when
    testee.sendContactRequest(contactRequest);

    // then
    verify(emailProxy).createEmailEvent(any());
  }

}