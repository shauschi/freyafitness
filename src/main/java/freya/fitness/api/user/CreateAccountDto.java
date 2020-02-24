package freya.fitness.api.user;

import freya.fitness.utils.validator.PasswordMatches;
import freya.fitness.utils.validator.ValidEmail;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import lombok.Data;

@Data
@PasswordMatches
public class CreateAccountDto implements WithPassword {

  @NotNull
  @NotEmpty
  private String firstname;

  @NotNull
  @NotEmpty
  private String lastname;

  @NotNull
  @NotEmpty
  @ValidEmail
  private String email;

  @NotNull
  @NotEmpty
  private String password;

  @NotNull
  @NotEmpty
  private String matchingPassword;

}
