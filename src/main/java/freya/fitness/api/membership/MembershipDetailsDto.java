package freya.fitness.api.membership;

import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class MembershipDetailsDto extends MembershipDto {

  private List<ParticipationDto> participations;

}
