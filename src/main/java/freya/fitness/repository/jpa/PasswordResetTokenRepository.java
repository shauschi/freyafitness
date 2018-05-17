package freya.fitness.repository.jpa;

import freya.fitness.domain.jpa.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, String> {
  Optional<PasswordResetToken> findByToken(final String token);
}
