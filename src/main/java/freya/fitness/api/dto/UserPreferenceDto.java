package freya.fitness.api.dto;

import java.util.UUID;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserPreferenceDto {

  private UUID id;

  @NotNull
  private UUID userId;

  @NotNull
  @NotEmpty
  private String key;

  private String value;

}
