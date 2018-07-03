package freya.fitness.service;

import freya.fitness.domain.jpa.PasswordResetToken;
import freya.fitness.domain.jpa.User;
import freya.fitness.utils.InvalidPasswordException;
import freya.fitness.utils.InvalidResetTokenException;
import freya.fitness.utils.MailTemplateNotFoundException;
import freya.fitness.utils.UserNotFoundException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PasswordService {

  private static final Logger LOGGER = LogManager.getLogger(PasswordService.class);

  @Value("${mail.resetpassword.subject}")
  private String subject;

  @Value("${mail.resetpassword.validity.hours:24}")
  private Integer validityHours;

  private final UserService userService;

  private final PasswordEncoder passwordEncoder;

  private final EmailService emailService;

  private final PasswordResetTokenService passwordResetTokenService;

  @Autowired
  public PasswordService(
      final UserService userService,
      final PasswordEncoder passwordEncoder,
      final EmailService emailService,
      final PasswordResetTokenService passwordResetTokenService) {
    this.userService = userService;
    this.passwordEncoder = passwordEncoder;
    this.emailService = emailService;
    this.passwordResetTokenService = passwordResetTokenService;
  }

  public void processForgotPassword(final String userEmail, final HttpServletRequest request)
      throws UserNotFoundException, MailTemplateNotFoundException, MessagingException {
    final User user = userService.getUserByEmail(userEmail);

    final PasswordResetToken resetToken = new PasswordResetToken();
    resetToken.setUser(user);
    resetToken.setToken(UUID.randomUUID().toString());
    final LocalDateTime now = LocalDateTime.now();
    resetToken.setExpiryTime(now.plusHours(validityHours));
    passwordResetTokenService.save(resetToken);

    final String text = getEmailText(userEmail, request, resetToken);
    emailService.sendMail(user.getEmail(), subject, text);
  }

  private String getEmailText(String userEmail, final HttpServletRequest request, final PasswordResetToken resetToken)
      throws MailTemplateNotFoundException {
    final String appUrl = request.getScheme() + "://" + request.getServerName();
    final String resetUrl = appUrl + "/?resetPasswordToken=" + resetToken.getToken() + "/#/";
    final String filename = "reset_password.html";
    try {
      final URL resource = Thread.currentThread().getContextClassLoader().getResource("reset_password.html");
      final URI uri = resource.toURI();
      final Path path = Paths.get(uri);
      final List<String> lines = Files.readAllLines(path);
      final String template = String.join("", lines);
      return String.format(template, userEmail, resetUrl);
    } catch (IOException | URISyntaxException | NullPointerException e) {
      LOGGER.error("Could not read reset password file");
      throw new MailTemplateNotFoundException(filename);
    }
  }

  public void processResetPassword(final String token, final String newPasswordRaw)
      throws InvalidResetTokenException {
    final PasswordResetToken passwordResetToken =
        passwordResetTokenService.findByToken(token);
    final User user = passwordResetToken.getUser();
    final String newPasswordEncoded = passwordEncoder.encode(newPasswordRaw);
    user.setPassword(newPasswordEncoded);
    passwordResetTokenService.delete(passwordResetToken);
    userService.saveUser(user);
  }

  public void changePassword(final String oldPassword, final String newPassword)
      throws InvalidPasswordException {
    final User user = userService.getCurrentUser();
    if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
      throw new InvalidPasswordException();
    }
    final String newPasswordEncoded = passwordEncoder.encode(newPassword);
    user.setPassword(newPasswordEncoded);
    userService.saveUser(user);
  }

}
