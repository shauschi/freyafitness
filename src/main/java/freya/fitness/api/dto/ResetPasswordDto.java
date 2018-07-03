package freya.fitness.api.dto;

import lombok.Data;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Data
public class ResetPasswordDto {

  @NotNull
  @NotEmpty
  private String password;

  @NotNull
  @NotEmpty
  private String token;

}
