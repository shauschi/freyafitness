package freya.fitness.api.dto;

import lombok.Data;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Data
public class EmailDto {

  @NotNull
  @NotEmpty
  private String email;

}
