package freya.fitness.dto;

import freya.fitness.domain.jpa.Role;
import freya.fitness.domain.jpa.User;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
public class UserDto {

  private String id;
  private String firstname;
  private String lastname;
  private String email;
  private List<String> roles;

  public UserDto(User user) {
    this.id = user.getId();
    this.firstname = user.getFirstName();
    this.lastname = user.getFamilyName();
    this.email = user.getEmail();
    this.roles = user.getRoles().stream()
        .map(Role::getAuthority)
        .collect(Collectors.toList());
  }

}
