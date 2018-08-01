package freya.fitness.api.dto;

import freya.fitness.domain.jpa.User;
import freya.fitness.domain.jpa.UserPreference;
import java.util.UUID;
import java.util.function.Predicate;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ProfileDto {

  private UUID id;
  private String firstname;
  private String lastname;
  private String email;

  public ProfileDto(final User user) {
    this.id = user.getId();
    this.firstname = user.getFirstName();
    this.lastname = user.getFamilyName();
    this.email = user.getEmail();
  }

  public static ProfileDto Anonymous() {
    final ProfileDto dto = new ProfileDto();
    dto.setFirstname("Anonymer");
    dto.setLastname("Benutzer");
    return dto;
  }

}
