package freya.fitness.service;

import freya.fitness.domain.jpa.User;
import freya.fitness.domain.jpa.UserPreference;
import freya.fitness.repository.jpa.UserPreferencesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserPreferencesService {

  @Autowired
  private UserPreferencesRepository userPreferencesRepository;

  public UserPreference save(final UserPreference userPreferences) {
    if (userPreferences == null) {
      return null;
    }
    return userPreferencesRepository.save(userPreferences);
  }

  public boolean checkUserPreferences(
      final User user,
      final String preferenceKey,
      final String exprectedValue) {
    return user.getPreferences().stream()
        .filter(userPreference -> preferenceKey.equals(userPreference.getKey()))
        .findFirst()
        .map(UserPreference::getValue)
        .filter(exprectedValue::equalsIgnoreCase)
        .isPresent();
  }

}
