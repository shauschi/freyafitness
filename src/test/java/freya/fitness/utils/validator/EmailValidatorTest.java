package freya.fitness.utils.validator;

import java.util.Set;
import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;

@RunWith(MockitoJUnitRunner.class)
public class EmailValidatorTest {

  private class Testee {
    @ValidEmail
    private String email;

    Testee(final String email) {
      this.email = email;
    }
  }

  private Validator validator;

  @Before
  public void setUp() {
    ValidatorFactory validatorFactory = Validation.buildDefaultValidatorFactory();
    this.validator = validatorFactory.getValidator();
  }

  @Test
  public void testValidEmail_invalid() {
    final Testee testee = new Testee("invalidmail");

    final Set<ConstraintViolation<Testee>> violations = validator.validate(testee);

    assertThat(violations.size(), equalTo(1));
    final ConstraintViolation<Testee> violation = violations.iterator().next();
    assertThat(violation.getMessage(), equalTo("Invalid email"));
  }

  @Test
  public void testValidEmail() {
    final Testee testee = new Testee("valid@mail.de");

    final Set<ConstraintViolation<Testee>> violations = validator.validate(testee);

    assertThat(violations.size(), equalTo(0));
  }

}