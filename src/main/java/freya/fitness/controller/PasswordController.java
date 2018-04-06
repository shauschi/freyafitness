package freya.fitness.controller;

import freya.fitness.domain.jpa.PasswordResetToken;
import freya.fitness.dto.MessageDto;
import freya.fitness.service.PasswordResetTokenService;
import freya.fitness.utils.InvalidResetTokenException;
import freya.fitness.service.PasswordService;
import freya.fitness.utils.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController("/password")
public class PasswordController {

  @Value("${mail.resetpassword.success}")
  private String successMessage;

  @Value("${mail.resetpassword.invalid}")
  private String invalidMessage;

  @Autowired
  private PasswordService passwordService;

  @Autowired
  private PasswordResetTokenService passwordResetTokenService;

  @PostMapping("/forgot")
  public MessageDto forgotPassword(
      @RequestParam("email") final String email,
      final HttpServletRequest request) throws UserNotFoundException {
    passwordService.processForgotPassword(email, request);
    return MessageDto.formatted(successMessage, email);
  }

  @GetMapping("/reset")
  public ModelAndView displayResetPasswordPage(@RequestParam("token") final String token) {
    final ModelAndView modelAndView = new ModelAndView("index.html");
    modelAndView.addObject("resetPassword", true);
    try {
      final PasswordResetToken passwordResetToken =
          passwordResetTokenService.findByToken(token);
      modelAndView.addObject("resetToken", passwordResetToken.getToken());
    } catch (final InvalidResetTokenException e) {
      modelAndView.addObject("errorMessage", "Oops! This is an invalid password reset link.");
    }
    return modelAndView;
  }

  @PostMapping("/reset")
  public MessageDto setNewPassword(
      @RequestParam("token") final String token,
      @RequestParam("password") final String password)
        throws InvalidResetTokenException, UserNotFoundException {
      passwordService.processResetPassword(token, password);
      return new MessageDto("You have successfully reset your password. You may now login.");
  }

}
