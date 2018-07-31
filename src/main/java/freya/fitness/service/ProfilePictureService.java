package freya.fitness.service;

import freya.fitness.domain.jpa.Role;
import freya.fitness.domain.jpa.User;
import freya.fitness.domain.jpa.UserPreference;
import freya.fitness.repository.mongodb.ProfilePictureRepository;
import freya.fitness.utils.Size;
import freya.fitness.utils.exception.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.UUID;

@Service
public class ProfilePictureService {

  @Autowired
  private ProfilePictureRepository profilePictureRepository;

  @Autowired
  private UserService userService;

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
    return !user.getPreferences().stream()
        .filter(userPreference -> UserPreference.VIEW_PROFILE_PICTURE.equals(userPreference.getKey()))
        .findFirst()
        .map(UserPreference::getValue)
        .filter("true"::equalsIgnoreCase)
        .isPresent();
  }
}
