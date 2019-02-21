package freya.fitness.utils.validator;

import freya.fitness.api.dto.WithPassword;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class PasswordMatchesValidator
    implements ConstraintValidator<PasswordMatches, WithPassword> {

  @Override
  public boolean isValid(final WithPassword dto, final ConstraintValidatorContext context) {
    return dto.getPassword().equals(dto.getMatchingPassword());
  }
}