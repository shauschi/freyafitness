package freya.fitness.api.user;

import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserPreferencesService {

  private final UserPreferencesRepository userPreferencesRepository;

  @Autowired
  public UserPreferencesService(
      final UserPreferencesRepository userPreferencesRepository) {
    this.userPreferencesRepository = userPreferencesRepository;
  }

  public List<UserPreference> getUserPreferences(final UUID userId) {
    return userPreferencesRepository.findByUserId(userId);
  }

  public UserPreference save(final UserPreference userPreferences) {
    if (userPreferences == null) {
      return null;
    }
    return userPreferencesRepository.save(userPreferences);
  }

  public boolean checkUserPreferences(final User user, final String preferenceKey, final String expectedValue) {
    for (UserPreference preference : user.getPreferences()) {
      if (preferenceKey.equals(preference.getKey())
          && expectedValue.equals(preference.getValue())) {
        return true;
      }
    }
    return false;
  }

}
