package freya.fitness.api.contact;

import freya.fitness.proxy.CreateEmail;
import freya.fitness.proxy.EmailProxy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;

@ExtendWith({MockitoExtension.class})
class ContactServiceTest {

  @InjectMocks
  private ContactService testee;

  @Mock
  private EmailProxy emailProxy;

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(testee, "emailTo", "testee@mail.com");
  }

  @Test
  void shouldSendFormattedMail() {
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
    verify(emailProxy).createEmail(any(CreateEmail.class));
  }

}
