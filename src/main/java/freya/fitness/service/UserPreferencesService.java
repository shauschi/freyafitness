package freya.fitness.service;

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

}
