package freya.fitness.api.controller;

import freya.fitness.api.dto.MessageDto;
import freya.fitness.api.dto.UserPreferenceDto;
import freya.fitness.api.mapping.UserPreferencesMapper;
import freya.fitness.domain.jpa.UserPreference;
import freya.fitness.service.UserPreferencesService;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

  @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
  @PostMapping("/")
  public MessageDto updatePreference(
      @RequestBody @Valid final UserPreferenceDto preferenceDto) {
    final UserPreference userPreferences = userPreferencesMapper.map(preferenceDto);
    userPreferencesService.save(userPreferences);
    return new MessageDto("Einstellungen aktualisiert");
  }

  @PreAuthorize("hasAuthority('ADMIN')")
  @GetMapping("/{id}")
  public List<UserPreferenceDto> getUserPreferences(@PathVariable("id") UUID id) {
    return userPreferencesService.getUserPreferences(id).stream()
        .map(userPreferencesMapper::map)
        .collect(Collectors.toList());
  }

}