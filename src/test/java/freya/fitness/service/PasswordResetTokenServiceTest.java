package freya.fitness.service;

import freya.fitness.domain.jpa.PasswordResetToken;
import freya.fitness.repository.jpa.PasswordResetTokenRepository;
import freya.fitness.utils.exception.InvalidResetTokenException;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.Optional;

import static org.hamcrest.Matchers.equalTo;
import static org.junit.Assert.assertThat;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class PasswordResetTokenServiceTest {

  @InjectMocks
  private PasswordResetTokenService testee;

  @Mock
  private PasswordResetTokenRepository repository;

  @Rule
  public ExpectedException expectedException = ExpectedException.none();

  @Test
  public void test_save_callsRepositorySave() {
    final PasswordResetToken anyToken = new PasswordResetToken();

    testee.save(anyToken);

    verify(repository).save(anyToken);
  }

  @Test
  public void test_delete_callsRepositoryDelete() {
    final PasswordResetToken anyToken = new PasswordResetToken();

    testee.delete(anyToken);

    verify(repository).delete(anyToken);
  }

  @Test
  public void test_findByToken_callsRepositoryFindByToken() throws InvalidResetTokenException {
    final PasswordResetToken anyToken = new PasswordResetToken();
    when(repository.findByToken("anyToken")).thenReturn(Optional.of(anyToken));

    PasswordResetToken result = testee.findByToken("anyToken");

    assertThat(result, equalTo(anyToken));
    verify(repository).findByToken("anyToken");
  }

  @Test
  public void test_findByToken_throwsExceptionOnInvalidToken()
      throws InvalidResetTokenException {
    expectedException.expect(InvalidResetTokenException.class);
    expectedException.expectMessage(contains("anyToken"));
    when(repository.findByToken("anyToken")).thenReturn(Optional.empty());

    testee.findByToken("anyToken");
  }
}