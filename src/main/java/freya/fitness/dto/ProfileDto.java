package freya.fitness.dto;

import freya.fitness.domain.User;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ProfileDto {

  private String firstname;
  private String lastname;
  private String email;

  public ProfileDto(User user) {
    this.firstname = user.getFirstName();
    this.lastname = user.getFamilyName();
    this.email = user.getEmail();
  }

}
