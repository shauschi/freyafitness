package freya.fitness.service;

import freya.fitness.domain.jpa.User;
import freya.fitness.repository.jpa.UserRepository;
import freya.fitness.repository.mongodb.ProfilePictureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;

@Service
public class ProfilePictureService {

  private final ProfilePictureRepository profilePictureRepository;

  private final UserRepository userRepository;

  @Autowired
  public ProfilePictureService(final ProfilePictureRepository profilePictureRepository
      , final UserRepository userRepository) {
    this.profilePictureRepository = profilePictureRepository;
    this.userRepository = userRepository;
  }

  public byte[] getProfilePictureData(final String profilePictureId) throws IOException {
    return profilePictureRepository.getById(profilePictureId);
  }

  @Transactional
  public void changeProfilePicture(final Long userId, final MultipartFile multipartFile)
      throws IOException {
    final User user = userRepository.findById(userId).orElseThrow(RuntimeException::new);
    if (user.getProfilePictureId() != null) {
      profilePictureRepository.delete(user.getProfilePictureId());
    }
    final String pictureId = profilePictureRepository.save(multipartFile);
    user.setProfilePictureId(pictureId);
    userRepository.save(user);
  }
}
