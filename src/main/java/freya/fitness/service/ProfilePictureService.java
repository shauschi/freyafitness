package freya.fitness.service;

import freya.fitness.domain.jpa.ProfilePicture;
import freya.fitness.domain.jpa.Role;
import freya.fitness.domain.jpa.User;
import freya.fitness.domain.jpa.UserPreference;
import freya.fitness.repository.jpa.PictureRepository;
import freya.fitness.utils.Size;
import freya.fitness.utils.exception.UserNotFoundException;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;
import javax.imageio.ImageIO;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProfilePictureService {

  private final UserService userService;

  private final UserPreferencesService userPreferencesService;

  private final PictureRepository pictureRepository;

  @Autowired
  public ProfilePictureService(
      final UserService userService,
      final UserPreferencesService userPreferencesService,
      final PictureRepository pictureRepository) {
    this.userService = userService;
    this.userPreferencesService = userPreferencesService;
    this.pictureRepository = pictureRepository;
  }

  public byte[] getProfilePictureData(final UUID userId, final Size size) {
    final User currentUser = userService.getCurrentUser();
    boolean showAll = currentUser.getRoles().stream()
        .map(Role::getAuthority)
        .anyMatch(auth -> "TRAINER".equals(auth) || "ADMIN".equals(auth));
    final User user = userService.getUser(userId);
    if (!showAll && userWantsPrivacy(user)) {
      return null;
    }
    return pictureRepository.findByUserIdAndSize(userId, size)
        .map(ProfilePicture::getData)
        .orElse(null);
  }

  @Transactional
  public void changeProfilePicture(final User user, final MultipartFile multipartFile)
      throws IOException, UserNotFoundException {
    userService.assertUserExists(user.getId());
    // delete all pictures for that id
    pictureRepository.deleteByUserId(user.getId());
    pictureRepository.flush();
    save(multipartFile, user);
  }

  private boolean userWantsPrivacy(final User user) {
    return !userPreferencesService.checkUserPreferences(
        user,
        UserPreference.VIEW_PROFILE_PICTURE,
        "true");
  }

  private void save(final MultipartFile multipartFile, final User user) throws IOException {
    if (multipartFile == null) {
      throw new IllegalArgumentException("cannot save null");
    }
    final InputStream is = multipartFile.getInputStream();
    final BufferedImage image = ImageIO.read(is);
    for (Size size : Size.values()) {
      final BufferedImage resizedImage = getResizedImage(image, size);
      final byte[] data = getImageAsBytes(resizedImage);

      final ProfilePicture picture = new ProfilePicture();
      picture.setUser(user);
      picture.setSize(size);
      picture.setData(data);
      pictureRepository.save(picture);
    }
  }

  private byte[] getImageAsBytes(final BufferedImage image) throws IOException {
    ByteArrayOutputStream os = new ByteArrayOutputStream();
    ImageIO.write(image,"png", os);
    return os.toByteArray();
  }

  private BufferedImage getResizedImage(final BufferedImage original, final Size targetSize) {
    if (Size.ORIGINAL == targetSize) {
      return original;
    }
    int preferredSize = targetSize.getPreferredSize();
    return createResizedCopy(original, preferredSize, preferredSize);
  }

  private BufferedImage createResizedCopy(final Image originalImage, int scaledWidth, int scaledHeight) {
    final Image tmp = originalImage.getScaledInstance(scaledWidth, scaledHeight, Image.SCALE_SMOOTH);
    final BufferedImage resized = new BufferedImage(scaledWidth, scaledHeight, BufferedImage.TYPE_INT_ARGB);
    final Graphics2D g = resized.createGraphics();
    g.setComposite(AlphaComposite.Src);
    g.drawImage(tmp, 0, 0, scaledWidth, scaledHeight, null);
    g.dispose();
    return resized;
  }
}
