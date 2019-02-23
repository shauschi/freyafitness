package freya.fitness.service;

import freya.fitness.domain.jpa.ProfilePicture;
import freya.fitness.domain.jpa.User;
import freya.fitness.domain.jpa.UserPreference;
import freya.fitness.repository.jpa.PictureRepository;
import freya.fitness.utils.Size;
import freya.fitness.utils.exception.UserNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.internal.util.collections.Sets;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import static freya.fitness.TestUtils.testUser;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatExceptionOfType;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class})
class ProfilePictureServiceTest {

  @InjectMocks
  private ProfilePictureService testee;

  @Mock
  private PictureRepository pictureRepository;

  @Mock
  private UserService userService;

  @Mock
  private UserPreferencesService userPreferencesService;

  private static final UUID userId = UUID.randomUUID();

  @Test
  void test_getProfilePictureData() throws IOException {
    when(userPreferencesService.checkUserPreferences(any(), any(), any())).thenCallRealMethod();
    final ProfilePicture profilePicture = new ProfilePicture();
    byte[] testFileBytes = getTestFileBytes();
    profilePicture.setData(testFileBytes);
    when(pictureRepository.findByUserIdAndSize(userId, Size.ORIGINAL))
        .thenReturn(Optional.of(profilePicture));
    User user = new User();
    user.setRoles(Collections.emptySet());
    UserPreference preference = new UserPreference();
    preference.setKey(UserPreference.VIEW_PROFILE_PICTURE);
    preference.setValue("true");
    user.setPreferences(Sets.newSet(preference));
    when(userService.getCurrentUser()).thenReturn(user);
    when(userService.getUser(any())).thenReturn(user);

    byte[] result = testee.getProfilePictureData(userId, Size.ORIGINAL);

    verify(pictureRepository).findByUserIdAndSize(userId, Size.ORIGINAL);
    assertThat(result).isEqualTo(testFileBytes);
  }

  @Test
  void test_changeProfilePicture_userNotFoundThrowsException() throws UserNotFoundException {
    assertThatExceptionOfType(UserNotFoundException.class).isThrownBy(() -> {
      final UUID uuid = UUID.randomUUID();
      final User user = testUser();
      user.setId(uuid);
      doThrow(UserNotFoundException.withId(uuid)).when(userService).assertUserExists(uuid);

      final MultipartFile multipartFile = getTestFile();

      testee.changeProfilePicture(user, multipartFile);
    });
  }

  @Test
  void test_changeProfilePicture_savePictureAndUpdateUser()
      throws IOException, UserNotFoundException {
    final UUID uuid = UUID.randomUUID();
    final User user = testUser();
    user.setId(uuid);
    final MultipartFile multipartFile = getTestFile();

    testee.changeProfilePicture(user, multipartFile);

    verify(pictureRepository).deleteByUserId(any());
    verify(pictureRepository, times(Size.values().length)).save(any());
  }

  @Test
  void test_changeProfilePicture_deleteCurrentPictureFromDbIfExists()
      throws IOException, UserNotFoundException {
    final UUID uuid = UUID.randomUUID();
    final User user = testUser();
    user.setId(uuid);
    final MultipartFile multipartFile = getTestFile();

    testee.changeProfilePicture(user, multipartFile);

    verify(pictureRepository).deleteByUserId(uuid);
    verify(pictureRepository, times(Size.values().length)).save(any());
  }

  private MultipartFile getTestFile() throws IOException {
    final byte[] data = getTestFileBytes();
    return new MockMultipartFile("logo.png", data);
  }

  private byte[] getTestFileBytes() throws IOException {
    final InputStream inputStream =
        getClass().getClassLoader().getResourceAsStream("logo.png");
    final byte[] data = new byte[inputStream.available()];
    //noinspection ResultOfMethodCallIgnored
    inputStream.read(data);
    return data;
  }
}