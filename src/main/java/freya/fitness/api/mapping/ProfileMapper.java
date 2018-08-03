package freya.fitness.api.mapping;

import freya.fitness.api.dto.ProfileDto;
import freya.fitness.domain.jpa.User;
import org.springframework.stereotype.Component;

@Component
public class ProfileMapper {

  public ProfileDto map(final User user) {
    if (user == null) {
      return null;
    }

    final ProfileDto dto = new ProfileDto();
    dto.setId(user.getId());
    dto.setFirstname(user.getFirstName());
    dto.setLastname(user.getFamilyName());
    dto.setEmail(user.getEmail());

    return dto;
  }

}
