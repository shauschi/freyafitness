package freya.fitness.api.dto;

import freya.fitness.utils.validator.ValidEmail;
import freya.fitness.utils.validator.ValidTelephone;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Data
public class ContactDto {

  @NotNull
  @NotEmpty
  private String firstname;

  @NotNull
  @NotEmpty
  private String lastname;

  @ValidEmail
  private String email;

  @ValidTelephone
  private String telephone;

  @NotNull
  @NotEmpty
  private String subject;

  @NotNull
  @NotEmpty
  private String message;

}
