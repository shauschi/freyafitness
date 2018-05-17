package freya.fitness.service;

import freya.fitness.domain.jpa.User;
import freya.fitness.repository.jpa.UserRepository;
import freya.fitness.repository.mongodb.ProfilePictureRepository;
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
  private UserRepository userRepository;

  public byte[] getProfilePictureData(final String profilePictureId) throws IOException {
    return profilePictureRepository.getById(profilePictureId);
  }

  @Transactional
  public User changeProfilePicture(final UUID userId, final MultipartFile multipartFile)
      throws IOException {
    final User user = userRepository.findById(userId).orElseThrow(RuntimeException::new);
    if (user.getProfilePictureId() != null) {
      profilePictureRepository.delete(user.getProfilePictureId());
    }
    final String pictureId = profilePictureRepository.save(multipartFile);
    user.setProfilePictureId(pictureId);
    return userRepository.save(user);
  }
}
