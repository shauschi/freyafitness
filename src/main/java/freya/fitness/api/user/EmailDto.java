package freya.fitness.api.user;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EmailDto {

  @NotNull
  @NotEmpty
  private String email;

}
