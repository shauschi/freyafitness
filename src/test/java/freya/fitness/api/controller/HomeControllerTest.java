package freya.fitness.api.controller;

import freya.fitness.domain.jpa.PasswordResetToken;
import freya.fitness.domain.jpa.User;
import freya.fitness.service.PasswordResetTokenService;
import freya.fitness.utils.exception.InvalidResetTokenException;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.Map;

import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.junit.Assert.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class HomeControllerTest {

  private static final String INVALID_TOKEN = "foo_bar_token";
  private static final String EXPIRED_TOKEN = "expired_token";
  private static final String VALID_TOKEN = "123_456_789";

  @InjectMocks
  private HomeController testee;

  @Mock
  private PasswordResetTokenService passwordResetTokenService;

  @Before
  public void setUp() throws InvalidResetTokenException {
    final PasswordResetToken token = new PasswordResetToken();
    token.setToken(VALID_TOKEN);
    token.setExpiryTime(LocalDateTime.now().plusHours(24));
    final User user = new User();
    user.setFirstName("Test");
    token.setUser(user);
    when(passwordResetTokenService.findByToken(VALID_TOKEN)).thenReturn(token);

    final PasswordResetToken expiredToken = new PasswordResetToken();
    expiredToken.setToken(EXPIRED_TOKEN);
    expiredToken.setExpiryTime(LocalDateTime.now().minusHours(12));
    when(passwordResetTokenService.findByToken(EXPIRED_TOKEN)).thenReturn(expiredToken);

    when(passwordResetTokenService.findByToken(INVALID_TOKEN))
        .thenThrow(new InvalidResetTokenException(INVALID_TOKEN));
  }

  @Test
  public void shouldReturnModelAndViewForLandingPage() throws InvalidResetTokenException {

    // when
    ModelAndView modelAndView = testee.index(null);

    // then
    assertThat(modelAndView, notNullValue());
    Map<String, Object> model = modelAndView.getModel();
    assertThat(model, notNullValue());
    assertThat(model.containsKey("resetPasswordToken"), is(false));
    assertThat(model.containsKey("errorMessage"), is(false));
    verify(passwordResetTokenService, never()).findByToken(any());
  }

  @Test
  public void shouldSetErrorMessageInModelForInvalidToken() throws InvalidResetTokenException {

    // when
    ModelAndView modelAndView = testee.index(INVALID_TOKEN);

    // then
    assertThat(modelAndView, notNullValue());
    Map<String, Object> model = modelAndView.getModel();
    assertThat(model, notNullValue());
    assertThat(model.containsKey("resetPasswordToken"), is(false));
    assertThat((String) model.get("errorMessage"),
        containsString("Das ist ein ungültiger Link"));
    verify(passwordResetTokenService).findByToken(INVALID_TOKEN);
  }

  @Test
  public void shouldSetErrorMessageInModelForExpiredToken() throws InvalidResetTokenException {

    // when
    ModelAndView modelAndView = testee.index(EXPIRED_TOKEN);

    // then
    assertThat(modelAndView, notNullValue());
    Map<String, Object> model = modelAndView.getModel();
    assertThat(model, notNullValue());
    assertThat(model.containsKey("resetPasswordToken"), is(false));
    assertThat((String) model.get("errorMessage"),
        containsString("leider abgelaufen"));
    verify(passwordResetTokenService).findByToken(EXPIRED_TOKEN);
  }

  @Test
  public void shouldSetResetPasswordTokenInModelForValidToken() throws InvalidResetTokenException {
    // when
    ModelAndView modelAndView = testee.index(VALID_TOKEN);

    // then
    assertThat(modelAndView, notNullValue());
    Map<String, Object> model = modelAndView.getModel();
    assertThat(model, notNullValue());
    assertThat(model.get("resetPasswordToken"), is(VALID_TOKEN));
    assertThat(model.containsKey("errorMessage"), is(false));
    verify(passwordResetTokenService).findByToken(VALID_TOKEN);
  }
}