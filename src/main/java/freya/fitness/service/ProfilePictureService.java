package freya.fitness.service;

import freya.fitness.repository.mongodb.ProfilePictureRepository;
import freya.fitness.utils.Size;
import freya.fitness.utils.UserNotFoundException;
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
    return profilePictureRepository.getByUserIdAndSize(userId, size);
  }

  @Transactional
  public void changeProfilePicture(final UUID userId, final MultipartFile multipartFile)
      throws IOException, UserNotFoundException {
    userService.assertUserExists(userId);
    profilePictureRepository.delete(userId);
    profilePictureRepository.save(multipartFile, userId);
  }
}
