package freya.fitness.dto;

import freya.fitness.domain.jpa.Role;
import freya.fitness.domain.jpa.User;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
public class UserDto {

  private UUID id;
  private String firstname;
  private String lastname;
  private String email;
  private Map<String, Boolean> roles;

  public UserDto(final User user) {
    this.id = user.getId();
    this.firstname = user.getFirstName();
    this.lastname = user.getFamilyName();
    this.email = user.getEmail();
    this.roles = user.getRoles().stream()
        .map(Role::getAuthority)
        .collect(Collectors.toMap(Function.identity(), role -> true));
  }

}
