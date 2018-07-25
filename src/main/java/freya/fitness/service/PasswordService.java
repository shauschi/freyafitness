package freya.fitness.service;

import freya.fitness.domain.jpa.PasswordResetToken;
import freya.fitness.domain.jpa.User;
import freya.fitness.utils.exception.InvalidPasswordException;
import freya.fitness.utils.exception.InvalidResetTokenException;
import freya.fitness.utils.exception.MailTemplateNotFoundException;
import freya.fitness.utils.exception.ResourceLoadingException;
import freya.fitness.utils.exception.UserNotFoundException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
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

  private final ResourceService resourceService;

  @Autowired
  public PasswordService(
      final UserService userService,
      final PasswordEncoder passwordEncoder,
      final EmailService emailService,
      final PasswordResetTokenService passwordResetTokenService,
      final ResourceService resourceService) {
    this.userService = userService;
    this.passwordEncoder = passwordEncoder;
    this.emailService = emailService;
    this.passwordResetTokenService = passwordResetTokenService;
    this.resourceService = resourceService;
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

    final String text = getEmailText(request, resetToken);
    emailService.sendMail(user.getEmail(), subject, text);
  }

  private String getEmailText(final HttpServletRequest request, final PasswordResetToken resetToken)
      throws MailTemplateNotFoundException {
    final String port = getPortFromRequest(request);
    final String appUrl = request.getScheme() + "://" + request.getServerName() + port;
    final String resetUrl = appUrl + "/?resetPasswordToken=" + resetToken.getToken();
    final String filename = "reset_password.html";
    final User user = resetToken.getUser();
    try {
      final String template = resourceService.getResourceAsString("reset_password.html");
      final Map<String, String> params = new HashMap<>();
      params.put("firstname", user.getFirstName());
      params.put("lastname", user.getFamilyName());
      params.put("resetUrl", resetUrl);

      return resourceService.replacePlaceholder(template, params);
    } catch (final ResourceLoadingException e) {
      LOGGER.error("Could not read reset password file");
      throw new MailTemplateNotFoundException(filename);
    }
  }

  private String getPortFromRequest(HttpServletRequest request) {
    int serverPort = request.getServerPort();
    if (80 == serverPort || 443 == serverPort) {
      return "";
    }
    return ":" + serverPort;
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
