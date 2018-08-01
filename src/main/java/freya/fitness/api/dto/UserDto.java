package freya.fitness.api.dto;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserDto {

  private UUID id;
  private String firstname;
  private String lastname;
  private String email;
  private Map<String, Boolean> roles;
  private List<MembershipDto> memberships;
  private List<UserPreferenceDto> preferences;

}
