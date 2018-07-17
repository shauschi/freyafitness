package freya.fitness.utils.validator;

import org.apache.commons.lang3.StringUtils;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class TelephoneValidator
    implements ConstraintValidator<ValidTelephone, String> {

  private static final String TELEPHONE_PATTERN = "^[+]?[0-9/ -]+$";

  @Override
  public void initialize(ValidTelephone constraintAnnotation) {
  }

  @Override
  public boolean isValid(final String telephone, final ConstraintValidatorContext context){
    return StringUtils.isBlank(telephone) || validateTelephone(telephone);
  }

  private boolean validateTelephone(final String telephone) {
    final Pattern pattern = Pattern.compile(TELEPHONE_PATTERN);
    final Matcher matcher = pattern.matcher(telephone);
    return matcher.matches();
  }
}
