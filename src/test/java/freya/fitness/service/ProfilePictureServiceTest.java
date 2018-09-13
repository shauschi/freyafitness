package freya.fitness.service;

import freya.fitness.domain.jpa.ProfilePicture;
import freya.fitness.domain.jpa.User;
import freya.fitness.domain.jpa.UserPreference;
import freya.fitness.repository.jpa.PictureRepository;
import freya.fitness.utils.Size;
import freya.fitness.utils.exception.UserNotFoundException;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.internal.util.collections.Sets;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import static freya.fitness.TestUtils.testUser;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class ProfilePictureServiceTest {

  @InjectMocks
  private ProfilePictureService testee;

  @Mock
  private PictureRepository pictureRepository;

  @Mock
  private UserService userService;

  @Spy
  private UserPreferencesService userPreferencesService;

  private static final UUID userId = UUID.randomUUID();

  @Test
  public void test_getProfilePictureData() throws IOException {
    final ProfilePicture profilePicture = new ProfilePicture();
    profilePicture.setData(getTestFileBytes());
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
    assertThat(result, equalTo(result));
  }

  @Test(expected = UserNotFoundException.class)
  public void test_changeProfilePicture_userNotFoundThrowsException()
      throws IOException, UserNotFoundException {
    final UUID uuid = UUID.randomUUID();
    final User user = testUser();
    user.setId(uuid);
    doThrow(UserNotFoundException.withId(uuid)).when(userService).assertUserExists(uuid);

    final MultipartFile multipartFile = getTestFile();

    testee.changeProfilePicture(user, multipartFile);
  }

  @Test
  public void test_changeProfilePicture_savePictureAndUpdateUser()
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
  public void test_changeProfilePicture_deleteCurrentPictureFromDbIfExists()
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
    final byte[] data = new byte[(int) inputStream.available()];
    inputStream.read(data);
    return data;
  }
}