package freya.fitness.dto;

import freya.fitness.utils.validator.PasswordMatches;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

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
