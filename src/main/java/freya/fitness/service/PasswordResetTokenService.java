package freya.fitness.service;

import freya.fitness.domain.jpa.PasswordResetToken;
import freya.fitness.repository.jpa.PasswordResetTokenRepository;
import freya.fitness.utils.InvalidResetTokenException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

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
