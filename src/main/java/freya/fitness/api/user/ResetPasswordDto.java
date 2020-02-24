package freya.fitness.api.user;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ResetPasswordDto {

  @NotNull
  @NotEmpty
  private String password;

  @NotNull
  @NotEmpty
  private String token;

}
