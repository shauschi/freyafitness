package freya.fitness.api.user;

import freya.fitness.proxy.CreateEmail;
import freya.fitness.proxy.EmailProxy;
import freya.fitness.utils.exception.InvalidPasswordException;
import freya.fitness.utils.exception.InvalidResetTokenException;
import freya.fitness.utils.exception.UserNotFoundException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import javax.servlet.http.HttpServletRequest;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasswordService {

  private static final Logger LOGGER = LogManager.getLogger(PasswordService.class);

  @Value("${mail.resetpassword.subject}")
  private String subject;

  @Value("${mail.resetpassword.validity.hours:24}")
  private Integer validityHours;

  private final UserService userService;

  private final PasswordEncoder passwordEncoder;

  private final EmailProxy emailProxy;

  private final PasswordResetTokenService passwordResetTokenService;

  @Autowired
  public PasswordService(
      final UserService userService,
      final PasswordEncoder passwordEncoder,
      final EmailProxy emailProxy,
      final PasswordResetTokenService passwordResetTokenService) {
    this.userService = userService;
    this.passwordEncoder = passwordEncoder;
    this.emailProxy = emailProxy;
    this.passwordResetTokenService = passwordResetTokenService;
  }

  public void processForgotPassword(
      final String userEmail, final HttpServletRequest request) throws UserNotFoundException {
    final User user = userService.getUserByEmail(userEmail);

    final Map<String, String> params = new HashMap<>();
    params.put("firstname", user.getFirstName());
    params.put("lastname", user.getFamilyName());
    final String resetUrl = getResetUrl(request, user);
    params.put("resetUrl", resetUrl);
    final CreateEmail event = new CreateEmail(
        "RESET_PASSWORD",
        params,
        Collections.singletonList(user.getEmail()),
        Collections.emptyList(),
        Collections.emptyList());

    emailProxy.createEmail(event);
  }

  private String getResetUrl(
      final HttpServletRequest request,
      final User user) {
    final PasswordResetToken resetToken = createPasswordResetToken(user);
    final String port = getPortFromRequest(request);
    final String appUrl = request.getScheme() + "://" + request.getServerName() + port;
    return appUrl + "/#/home/m/password/reset/" + resetToken.getToken();
  }

  private PasswordResetToken createPasswordResetToken(User user) {
    final PasswordResetToken resetToken = new PasswordResetToken();
    resetToken.setUser(user);
    resetToken.setToken(UUID.randomUUID().toString());
    final LocalDateTime now = LocalDateTime.now();
    resetToken.setExpiryTime(now.plusHours(validityHours));
    passwordResetTokenService.save(resetToken);
    return resetToken;
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
