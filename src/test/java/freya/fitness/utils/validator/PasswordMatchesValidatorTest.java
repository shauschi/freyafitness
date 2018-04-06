package freya.fitness.utils.validator;

import freya.fitness.dto.CreateAccountDto;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import java.util.Set;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;

@RunWith(MockitoJUnitRunner.class)
public class PasswordMatchesValidatorTest {

  private Validator validator;

  @Before
  public void setUp() {
    ValidatorFactory validatorFactory = Validation.buildDefaultValidatorFactory();
    this.validator = validatorFactory.getValidator();
  }

  @Test
  public void testPasswordMatches_invalid() {
    final CreateAccountDto createAccountDto = validCreateAccountDto();
    createAccountDto.setMatchingPassword("anx");

    final Set<ConstraintViolation<CreateAccountDto>> violations =
        validator.validate(createAccountDto);

    assertThat(violations.size(), equalTo(1));
    final ConstraintViolation<CreateAccountDto> violation = violations.iterator().next();
    assertThat(violation.getMessage(), equalTo("Passwords don't match"));
  }

  @Test
  public void testPasswordMatches() {
    final CreateAccountDto createAccountDto = validCreateAccountDto();

    final Set<ConstraintViolation<CreateAccountDto>> violations =
        validator.validate(createAccountDto);

    assertThat(violations.size(), equalTo(0));
  }

  private CreateAccountDto validCreateAccountDto() {
    final CreateAccountDto createAccountDto = new CreateAccountDto();
    createAccountDto.setFirstname("Firstname");
    createAccountDto.setLastname("Lastname");
    createAccountDto.setEmail("valid@mail.de");
    createAccountDto.setPassword("any");
    createAccountDto.setMatchingPassword("any");
    return createAccountDto;
  }

}