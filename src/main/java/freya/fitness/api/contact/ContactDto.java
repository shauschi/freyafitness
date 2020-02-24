package freya.fitness.api.contact;

import freya.fitness.utils.validator.ValidEmail;
import freya.fitness.utils.validator.ValidTelephone;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import lombok.Data;

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
