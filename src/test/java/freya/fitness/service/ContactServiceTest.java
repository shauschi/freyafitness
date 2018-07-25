package freya.fitness.service;

import freya.fitness.api.dto.ContactDto;
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
  private EmailService emailService;

  @Mock
  private ResourceService resourceService;

  @Rule
  public ExpectedException expectedException = ExpectedException.none();

  @Before
  public void setUp() {
    ReflectionTestUtils.setField(testee, "emailTo", "testee@mail.com");
  }

  @Test
  public void shouldThrowExceptionWhenMailTemplateIsNotFound()
      throws ResourceLoadingException, MessagingException, MailTemplateNotFoundException {
    expectedException.expect(MailTemplateNotFoundException.class);

    // given
    final ContactDto contactRequest = new ContactDto();
    when(resourceService.getResourceAsString(any()))
        .thenThrow(new ResourceLoadingException(""));

    // when
    testee.sendContactRequest(contactRequest);

    // then
    // see expected exception
  }

  @Test
  public void shouldSendFormattedMail()
      throws ResourceLoadingException, MessagingException, MailTemplateNotFoundException {
    // given
    final ContactDto contactRequest = new ContactDto();
    contactRequest.setFirstname("Max");
    contactRequest.setLastname("Muster");
    contactRequest.setEmail("request@mail.com");
    contactRequest.setTelephone("0049 123 456789");
    contactRequest.setSubject("Hello World");
    contactRequest.setMessage("Fancy message\n\nwith line break.");
    when(resourceService.getResourceAsString(any()))
        .thenReturn("Hello ${firstname} ${lastname}, ${email} or ${telephone}. ${message}");
    when(resourceService.replacePlaceholder(any(), any())).thenCallRealMethod();

    // when
    testee.sendContactRequest(contactRequest);

    // then
    verify(emailService).sendMail(
        eq("testee@mail.com"),
        contains(contactRequest.getSubject()),
        eq("Hello Max Muster, request@mail.com or 0049 123 456789."
            + " Fancy message<br/><br/>with line break."));
  }

}