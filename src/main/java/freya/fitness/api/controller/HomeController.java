package freya.fitness.api.controller;

import freya.fitness.domain.jpa.PasswordResetToken;
import freya.fitness.service.PasswordResetTokenService;
import freya.fitness.utils.exception.InvalidResetTokenException;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;

@Controller
public class HomeController {

  private static final Logger LOGGER = LogManager.getLogger(HomeController.class);
  private static final String ERROR_MESSAGE = "errorMessage";
  private static final String RESET_PASSWORD = "resetPassword";
  private static final String RESET_PASSWORD_TOKEN = "resetPasswordToken";

  private final PasswordResetTokenService passwordResetTokenService;

  @Autowired
  public HomeController(PasswordResetTokenService passwordResetTokenService) {
    this.passwordResetTokenService = passwordResetTokenService;
  }

  /**
   * Returns the index of the web application and sets additional values if necessary.
   *
   * @param resetPasswordToken optional reset token from reset password mail
   * @return model and view of the main application
   */
  @GetMapping("/")
  public ModelAndView index(
      @RequestParam(value = "resetPasswordToken", required = false)
      final String resetPasswordToken) {
    final ModelAndView modelAndView = new ModelAndView("index.html");
    if (StringUtils.isNotEmpty(resetPasswordToken)) {
      return processResetPasswordToken(modelAndView, resetPasswordToken);
    }
    return modelAndView;
  }

  private ModelAndView processResetPasswordToken(final ModelAndView modelAndView, final String token) {
    modelAndView.addObject(RESET_PASSWORD, true);
    final PasswordResetToken passwordResetToken;
    try {
      passwordResetToken = passwordResetTokenService.findByToken(token);
    } catch (final InvalidResetTokenException e) {
      LOGGER.warn("Someone tried to use an invalid reset token: {}", token);
      return modelAndView.addObject(ERROR_MESSAGE,
          "Oops! Das ist ein ungültiger Link."
              + " Wenn du den Link per E-Mail erhalten hast, weil du dein Passwort vergessen hast,"
              + " wende dich bitte an Freya.");
    }

    final LocalDateTime expiry = passwordResetToken.getExpiryTime();
    if (expiry.isBefore(LocalDateTime.now())) {
      LOGGER.info("Expired token used: {}", token);
      return modelAndView.addObject(ERROR_MESSAGE,
          "Tut uns leid, der Link zum Zurücksetzen deines Passwords"
              + " ist leider abgelaufen. Der Link hat eine Gültigkeit von 24 Stunden."
              + " Klicke einfach erneut auf \"Password vergessen\" und versuche es noch einmal."
              + " Solltest du Probleme beim Zurücksetzen deines Passworts haben,"
              + " melde dich bitte bei Freya.");
    } else {
      LOGGER.debug("Used token {} to reset the password for user {}",
          token, passwordResetToken.getUser().getId());
      return modelAndView.addObject(RESET_PASSWORD_TOKEN, token);
    }
  }
}
