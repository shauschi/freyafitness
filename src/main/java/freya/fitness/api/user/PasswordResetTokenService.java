package freya.fitness.api.user;

import freya.fitness.utils.exception.InvalidResetTokenException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PasswordResetTokenService {

  @Autowired
  private PasswordResetTokenRepository passwordResetTokenRepository;

  public PasswordResetToken save(final PasswordResetToken passwordResetToken) {
    return passwordResetTokenRepository.save(passwordResetToken);
  }

  public void delete(final PasswordResetToken passwordResetToken) {
    passwordResetTokenRepository.delete(passwordResetToken);
  }

  public PasswordResetToken findByToken(final String token)
      throws InvalidResetTokenException {
    return passwordResetTokenRepository.findByToken(token)
        .orElseThrow(() -> new InvalidResetTokenException(token));
  }
}
