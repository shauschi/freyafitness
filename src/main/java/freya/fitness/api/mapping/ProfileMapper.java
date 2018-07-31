package freya.fitness.api.mapping;

import freya.fitness.api.dto.ProfileDto;
import freya.fitness.domain.jpa.User;
import freya.fitness.domain.jpa.UserPreference;
import org.springframework.stereotype.Component;

@Component
public class ProfileMapper {

  public ProfileDto map(final User user) {
    return this.map(user, true);
  }

  public ProfileDto map(final User user, boolean showAll) {
    if (user == null) {
      return null;
    }

    if (!showAll && userWantsPrivacy(user)) {
      return ProfileDto.Anonymous();
    }

    final ProfileDto dto = new ProfileDto();
    dto.setId(user.getId());
    dto.setFirstname(user.getFirstName());
    dto.setLastname(user.getFamilyName());
    dto.setEmail(user.getEmail());

    return dto;
  }

  private boolean userWantsPrivacy(final User user) {
    return !user.getPreferences().stream()
        .filter(userPreference -> UserPreference.VIEW_PARTICIPATION.equals(userPreference.getKey()))
        .findFirst()
        .map(UserPreference::getValue)
        .filter("true"::equalsIgnoreCase)
        .isPresent();
  }

}
