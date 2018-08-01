package freya.fitness.api.mapping;

import freya.fitness.api.dto.UserPreferenceDto;
import freya.fitness.api.dto.ValidityDto;
import freya.fitness.domain.jpa.User;
import freya.fitness.domain.jpa.UserPreference;
import freya.fitness.repository.jpa.UserPreferencesRepository;
import freya.fitness.service.UserService;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserPreferencesMapper {

  @Autowired
  private UserService userService;

  @Autowired
  private UserPreferencesRepository userPreferencesRepository;

  public UserPreference map(final UserPreferenceDto dto) {
    if (dto == null) {
      return null;
    }
    final UserPreference userPreference = Optional.of(dto)
        .map(UserPreferenceDto::getKey)
        .map(userPreferencesRepository::findByKey)
        .filter(Optional::isPresent)
        .map(Optional::get)
        .orElseGet(UserPreference::new);

    final User user = userService.getUser(dto.getUserId());
    userPreference.setUser(user);
    userPreference.setKey(dto.getKey());
    userPreference.setValue(dto.getValue());

    return userPreference;
  }

  public UserPreferenceDto map(final UserPreference preference) {
    if (preference == null) {
      return null;
    }
    final UserPreferenceDto dto = new UserPreferenceDto();
    dto.setId(preference.getId());
    dto.setUserId(preference.getUser().getId());
    dto.setKey(preference.getKey());
    dto.setValue(preference.getValue());

    return dto;
  }

}
