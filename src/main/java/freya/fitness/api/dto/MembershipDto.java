package freya.fitness.api.dto;

import java.util.UUID;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
public class MembershipDto {

  private UUID id;

  @NotNull
  @NotEmpty
  private UUID membershipTypeId;

  @NotNull
  @NotEmpty
  private ValidityDto validity;

  private ProfileDto user;

  private long participationCount;

}
