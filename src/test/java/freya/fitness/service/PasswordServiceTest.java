package freya.fitness.service;

import freya.fitness.domain.jpa.PasswordResetToken;
import freya.fitness.domain.jpa.User;
import freya.fitness.utils.InvalidResetTokenException;
import freya.fitness.utils.UserNotFoundException;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.mockito.ArgumentMatcher;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class PasswordServiceTest {

  @InjectMocks
  private PasswordService testee;

  @Mock
  private UserService userService;

  @Mock
  private PasswordEncoder passwordEncoder;

  @Mock
  private EmailService emailService;

  @Mock
  private PasswordResetTokenService passwordResetTokenService;

  @Rule
  public ExpectedException expectedExeption = ExpectedException.none();

  @Before
  public void setUp() {
    ReflectionTestUtils.setField(testee, "sender", "testsender@unit.test");
    ReflectionTestUtils.setField(testee, "subject", "testing password service");
    ReflectionTestUtils.setField(testee, "message", "new message");
    ReflectionTestUtils.setField(testee, "validityHours", 3);
  }

  @Test
  public void test_processForgotPassword_userNotFound() throws UserNotFoundException {
    HttpServletRequest mockRequest = mock(HttpServletRequest.class);
    expectedExeption.expect(UserNotFoundException.class);
    when(userService.getUserByEmail(any())).thenThrow(UserNotFoundException.withEmail(""));

    testee.processForgotPassword("user@test.mail", mockRequest);
  }

  @Test
  public void test_processForgotPassword() throws UserNotFoundException {
    HttpServletRequest mockRequest = mock(HttpServletRequest.class);
    when(mockRequest.getScheme()).thenReturn("http");
    when(mockRequest.getServerName()).thenReturn("test.server");
    User user = new User();
    user.setEmail("user@test.mail");
    user.setFirstName("Testuser");
    when(userService.getUserByEmail(user.getEmail())).thenReturn(user);

    testee.processForgotPassword(user.getEmail(), mockRequest);

    ArgumentMatcher<PasswordResetToken> expectedToken = token ->
      "Testuser".equals(token.getUser().getFirstName())
          && token.getExpiryTime().isBefore(LocalDateTime.now().plusHours(3));
    verify(passwordResetTokenService).save(argThat(expectedToken));

    ArgumentMatcher<SimpleMailMessage> expectedMail = mail ->
        user.getEmail().equals(mail.getTo()[0])
        && "testsender@unit.test".equals(mail.getFrom())
        && "testing password service".equals(mail.getSubject())
        && mail.getText().contains("new message");
    verify(emailService).sendMail(argThat(expectedMail));
  }

  @Test
  public void test_processResetPassword_invalidToken() throws InvalidResetTokenException {
    String newToken = "newToken";
    expectedExeption.expect(InvalidResetTokenException.class);
    expectedExeption.expectMessage(newToken);
    when(passwordResetTokenService.findByToken(newToken))
        .thenThrow(new InvalidResetTokenException(newToken));

    testee.processResetPassword(newToken, "anyPassword");
  }

  @Test
  public void test_processResetPassword_userNotFound() throws InvalidResetTokenException{
    User user = new User();
    String newToken = "newToken";
    PasswordResetToken passwordResetToken = new PasswordResetToken();
    passwordResetToken.setToken(newToken);
    passwordResetToken.setUser(user);
    when(passwordResetTokenService.findByToken(newToken))
        .thenReturn(passwordResetToken);
    when(passwordEncoder.encode("anyPassword")).thenReturn("encodedPassword");

    testee.processResetPassword(newToken, "anyPassword");

    verify(passwordResetTokenService).findByToken(newToken);
    verify(passwordEncoder).encode("anyPassword");
    verify(passwordResetTokenService).delete(passwordResetToken);
    verify(userService).saveUser(argThat(u -> "encodedPassword".equals(u.getPassword())));
  }

}