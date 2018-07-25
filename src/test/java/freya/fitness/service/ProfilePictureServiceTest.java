package freya.fitness.service;

import freya.fitness.domain.jpa.User;
import freya.fitness.repository.mongodb.ProfilePictureRepository;
import freya.fitness.utils.Size;
import freya.fitness.utils.exception.UserNotFoundException;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

import static freya.fitness.TestUtils.testUser;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class ProfilePictureServiceTest {

  @InjectMocks
  private ProfilePictureService testee;

  @Mock
  private ProfilePictureRepository profilePictureRepository;

  @Mock
  private UserService userService;

  private static final UUID userId = UUID.randomUUID();

  @Test
  public void test_getProfilePictureData() throws IOException {
    when(profilePictureRepository.getByUserIdAndSize(userId, Size.ORIGINAL))
        .thenReturn(new byte[]{1, 0, 1, 1});

    byte[] result = testee.getProfilePictureData(userId, Size.ORIGINAL);

    verify(profilePictureRepository).getByUserIdAndSize(userId, Size.ORIGINAL);
    assertThat(result, equalTo(result));
  }

  @Test(expected = UserNotFoundException.class)
  public void test_changeProfilePicture_userNotFoundThrowsException()
      throws IOException, UserNotFoundException {
    final UUID uuid = UUID.randomUUID();
    doThrow(UserNotFoundException.withId(uuid)).when(userService).assertUserExists(uuid);

    MultipartFile multipartFile = new MockMultipartFile("test.file", new byte[]{1, 0});

    testee.changeProfilePicture(uuid, multipartFile);
  }

  @Test
  public void test_changeProfilePicture_savePictureAndUpdateUser()
      throws IOException, UserNotFoundException {
    final UUID uuid = UUID.randomUUID();
    final User user = testUser();
    user.setId(uuid);
    MultipartFile multipartFile = new MockMultipartFile("test.file", new byte[]{1, 0});

    testee.changeProfilePicture(uuid, multipartFile);

    verify(profilePictureRepository).delete(any());
    verify(profilePictureRepository).save(multipartFile, uuid);
  }

  @Test
  public void test_changeProfilePicture_deleteCurrentPictureFromDbIfExists()
      throws IOException, UserNotFoundException {
    final UUID uuid = UUID.randomUUID();
    final MultipartFile multipartFile =
        new MockMultipartFile("test.file", new byte[]{1, 0});

    testee.changeProfilePicture(uuid, multipartFile);

    verify(profilePictureRepository).delete(uuid);
    verify(profilePictureRepository).save(multipartFile, uuid);
  }
}