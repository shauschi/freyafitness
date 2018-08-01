package freya.fitness.api.controller;

import freya.fitness.api.dto.MessageDto;
import freya.fitness.api.dto.UserPreferenceDto;
import freya.fitness.api.mapping.UserPreferencesMapper;
import freya.fitness.domain.jpa.UserPreference;
import freya.fitness.service.UserPreferencesService;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/preferences")
public class PreferencesController {

  private final UserPreferencesService userPreferencesService;

  private final UserPreferencesMapper userPreferencesMapper;

  @Autowired
  public PreferencesController(final UserPreferencesService userPreferencesService,
                               final UserPreferencesMapper userPreferencesMapper) {
    this.userPreferencesService = userPreferencesService;
    this.userPreferencesMapper = userPreferencesMapper;
  }

  @PreAuthorize("hasAnyAuthority('USER', 'TRAINER', 'ADMIN')")
  @PostMapping("/")
  public MessageDto updatePreference(
      @RequestBody @Valid final UserPreferenceDto preferenceDto) {
    final UserPreference userPreferences = userPreferencesMapper.map(preferenceDto);
    userPreferencesService.save(userPreferences);
    return new MessageDto("Einstellungen aktualisiert");
  }

}