package freya.fitness.api.dto;

import freya.fitness.domain.jpa.User;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

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

}
