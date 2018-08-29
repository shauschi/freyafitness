package freya.fitness.api.dto;

import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class MembershipDetailsDto extends MembershipDto {

  private List<ParticipationDto> participations;

}
