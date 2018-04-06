package freya.fitness.service;

import freya.fitness.domain.jpa.PasswordResetToken;
import freya.fitness.domain.jpa.User;
import freya.fitness.utils.InvalidResetTokenException;
import freya.fitness.utils.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordService {

  @Value("${mail.resetpassword.sender}")
  private String sender;

  @Value("${mail.resetpassword.subject}")
  private String subject;

  @Value("${mail.resetpassword.message}")
  private String message;

  @Value("${mail.resetpassword.validity.hours:24}")
  private Integer validityHours;

  @Autowired
  private UserService userService;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private EmailService emailService;

  @Autowired
  private PasswordResetTokenService passwordResetTokenService;

  public void processForgotPassword(
      final String userEmail, final HttpServletRequest request) throws UserNotFoundException {
    final User user = userService.getUserByEmail(userEmail);

    final PasswordResetToken resetToken = new PasswordResetToken();
    resetToken.setUser(user);
    resetToken.setToken(UUID.randomUUID().toString());
    final LocalDateTime now = LocalDateTime.now();
    resetToken.setExpiryTime(now.plusHours(validityHours));
    passwordResetTokenService.save(resetToken);

    final String appUrl = request.getScheme() + "://" + request.getServerName();
    final String resetUrl = appUrl + "/reset?token=" + resetToken.getToken();

    final SimpleMailMessage passwordResetEmail = new SimpleMailMessage();
    passwordResetEmail.setFrom(sender);
    passwordResetEmail.setTo(user.getEmail());
    passwordResetEmail.setSubject(subject);
    passwordResetEmail.setText(String.format(message, resetUrl));

    emailService.sendMail(passwordResetEmail);
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

}
