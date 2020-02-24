package freya.fitness.api.user;

import freya.fitness.utils.validator.PasswordMatches;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import lombok.Data;

@Data
@PasswordMatches
public class ChangePasswordDto implements WithPassword {

  @NotNull
  @NotEmpty
  private String oldPassword;

  @NotNull
  @NotEmpty
  private String password;

  @NotNull
  @NotEmpty
  private String matchingPassword;

}
