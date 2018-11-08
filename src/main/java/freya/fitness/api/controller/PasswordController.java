package freya.fitness.api.controller;

import freya.fitness.api.dto.ChangePasswordDto;
import freya.fitness.api.dto.EmailDto;
import freya.fitness.api.dto.MessageDto;
import freya.fitness.api.dto.ResetPasswordDto;
import freya.fitness.service.PasswordService;
import freya.fitness.utils.exception.InvalidPasswordException;
import freya.fitness.utils.exception.InvalidResetTokenException;
import freya.fitness.utils.exception.UserNotFoundException;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/password")
public class PasswordController {

  @Value("${mail.resetpassword.success}")
  private String successMessage;

  @Value("${mail.resetpassword.invalid}")
  private String invalidMessage;

  private final PasswordService passwordService;

  @Autowired
  public PasswordController(final PasswordService passwordService) {
    this.passwordService = passwordService;
  }

  @PostMapping("/forgot")
  public MessageDto forgotPassword(
      @RequestBody @Valid final EmailDto email, final HttpServletRequest request)
      throws UserNotFoundException {
    final String value = email.getEmail();
    passwordService.processForgotPassword(value, request);
    return MessageDto.formatted(successMessage, value);
  }

  @PostMapping("/reset")
  public MessageDto setNewPassword(
      @RequestBody @Valid final ResetPasswordDto resetPassword)
        throws InvalidResetTokenException {
    passwordService.processResetPassword(resetPassword.getToken(), resetPassword.getPassword());
    return new MessageDto("Dein Password wurde zurückgesetzt. Du kannst dich jetzt mit deinem neuen Passwort anmelden.");
  }

  @PreAuthorize("hasAnyAuthority('USER', 'TRAINER', 'ADMIN')")
  @PostMapping("/change")
  public MessageDto changePassword(
      @RequestBody @Valid final ChangePasswordDto data) throws InvalidPasswordException {
    passwordService.changePassword(data.getOldPassword(), data.getPassword());
    return new MessageDto("Dein Passwort wurde erfolgreich geändert.");
  }

}
