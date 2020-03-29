package freya.fitness.api.user;

import freya.fitness.proxy.CreateEmail;
import freya.fitness.proxy.EmailProxy;
import freya.fitness.utils.exception.InvalidResetTokenException;
import freya.fitness.utils.exception.UserNotFoundException;
import java.time.LocalDateTime;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatcher;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.AssertionsForClassTypes.assertThatExceptionOfType;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class})
class PasswordServiceTest {

  @InjectMocks
  private PasswordService testee;

  @Mock
  private UserService userService;

  @Mock
  private PasswordEncoder passwordEncoder;

  @Mock
  private EmailProxy emailProxy;

  @Mock
  private PasswordResetTokenService passwordResetTokenService;

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(testee, "subject", "testing password service");
    ReflectionTestUtils.setField(testee, "validityHours", 3);
  }

  @Test
  void test_processForgotPassword_userNotFound() throws UserNotFoundException {
    when(userService.getUserByEmail(any())).thenThrow(UserNotFoundException.withEmail(""));

    assertThatExceptionOfType(UserNotFoundException.class).isThrownBy(
        () -> testee.processForgotPassword("user@test.mail")
    );
  }

  @Test
  void test_processForgotPassword() throws UserNotFoundException {
    User user = new User();
    user.setEmail("user@test.mail");
    user.setFirstName("Testuser");
    user.setFamilyName("007");
    when(userService.getUserByEmail(user.getEmail())).thenReturn(user);

    // when
    testee.processForgotPassword(user.getEmail());

    // then
    ArgumentMatcher<PasswordResetToken> expectedToken = token ->
      "Testuser".equals(token.getUser().getFirstName())
          && token.getExpiryTime().isAfter(LocalDateTime.now());
    verify(passwordResetTokenService).save(argThat(expectedToken));

    verify(emailProxy).createEmail(any(CreateEmail.class));
  }

  @Test
  void test_processResetPassword_invalidToken() throws InvalidResetTokenException {
    String newToken = "newToken";
    when(passwordResetTokenService.findByToken(newToken))
        .thenThrow(new InvalidResetTokenException(newToken));

    assertThatExceptionOfType(InvalidResetTokenException.class).isThrownBy(
        () -> testee.processResetPassword(newToken, "anyPassword")
    ).withMessageContaining(newToken);
  }

  @Test
  void test_processResetPassword_userNotFound() throws InvalidResetTokenException{
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
