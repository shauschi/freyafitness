package freya.fitness.utils.validator;

import freya.fitness.dto.CreateAccountDto;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class PasswordMatchesValidator
    implements ConstraintValidator<PasswordMatches, CreateAccountDto> {

  @Override
  public void initialize(PasswordMatches constraintAnnotation) {
  }

  @Override
  public boolean isValid(final CreateAccountDto user, final ConstraintValidatorContext context){
    return user.getPassword().equals(user.getMatchingPassword());
  }
}