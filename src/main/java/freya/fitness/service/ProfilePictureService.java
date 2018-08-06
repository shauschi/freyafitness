package freya.fitness.service;

import freya.fitness.domain.jpa.Role;
import freya.fitness.domain.jpa.User;
import freya.fitness.domain.jpa.UserPreference;
import freya.fitness.repository.mongodb.ProfilePictureRepository;
import freya.fitness.utils.Size;
import freya.fitness.utils.exception.UserNotFoundException;
import java.io.IOException;
import java.util.UUID;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProfilePictureService {

  private final ProfilePictureRepository profilePictureRepository;

  private final UserService userService;

  private final UserPreferencesService userPreferencesService;

  @Autowired
  public ProfilePictureService(
      final ProfilePictureRepository profilePictureRepository,
      final UserService userService,
      final UserPreferencesService userPreferencesService) {
    this.profilePictureRepository = profilePictureRepository;
    this.userService = userService;
    this.userPreferencesService = userPreferencesService;
  }

  public byte[] getProfilePictureData(final UUID userId, final Size size) throws IOException {
    final User currentUser = userService.getCurrentUser();
    boolean showAll = currentUser.getRoles().stream()
        .map(Role::getAuthority)
        .anyMatch(auth -> "TRAINER".equals(auth) || "ADMIN".equals(auth));
    final User user = userService.getUser(userId);
    if (!showAll && userWantsPrivacy(user)) {
      return null;
    }
    return profilePictureRepository.getByUserIdAndSize(userId, size);
  }

  @Transactional
  public void changeProfilePicture(final UUID userId, final MultipartFile multipartFile)
      throws IOException, UserNotFoundException {
    userService.assertUserExists(userId);
    profilePictureRepository.delete(userId);
    profilePictureRepository.save(multipartFile, userId);
  }

  private boolean userWantsPrivacy(final User user) {
    return !userPreferencesService.checkUserPreferences(
        user,
        UserPreference.VIEW_PROFILE_PICTURE,
        "true");
  }
}
