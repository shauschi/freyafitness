package freya.fitness.service;

import freya.fitness.domain.jpa.PasswordResetToken;
import freya.fitness.repository.jpa.PasswordResetTokenRepository;
import freya.fitness.utils.exception.InvalidResetTokenException;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatExceptionOfType;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class})
class PasswordResetTokenServiceTest {

  @InjectMocks
  private PasswordResetTokenService testee;

  @Mock
  private PasswordResetTokenRepository repository;

  @Test
  void test_save_callsRepositorySave() {
    final PasswordResetToken anyToken = new PasswordResetToken();

    testee.save(anyToken);

    verify(repository).save(anyToken);
  }

  @Test
  void test_delete_callsRepositoryDelete() {
    final PasswordResetToken anyToken = new PasswordResetToken();

    testee.delete(anyToken);

    verify(repository).delete(anyToken);
  }

  @Test
  void test_findByToken_callsRepositoryFindByToken() throws InvalidResetTokenException {
    final PasswordResetToken anyToken = new PasswordResetToken();
    when(repository.findByToken("anyToken")).thenReturn(Optional.of(anyToken));

    PasswordResetToken result = testee.findByToken("anyToken");

    assertThat(result).isEqualTo(anyToken);
    verify(repository).findByToken("anyToken");
  }

  @Test
  void test_findByToken_throwsExceptionOnInvalidToken() {
    when(repository.findByToken("anyToken")).thenReturn(Optional.empty());

    assertThatExceptionOfType(InvalidResetTokenException.class).isThrownBy(
        () -> testee.findByToken("anyToken")
    ).withMessageContaining("anyToken");
  }
}