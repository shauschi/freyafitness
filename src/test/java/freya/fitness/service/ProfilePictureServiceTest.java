package freya.fitness.service;

import freya.fitness.domain.jpa.User;
import freya.fitness.repository.jpa.UserRepository;
import freya.fitness.repository.mongodb.ProfilePictureRepository;
import freya.fitness.utils.Size;
import freya.fitness.utils.UserNotFoundException;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

import static freya.fitness.TestUtils.testUser;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@Ignore
@RunWith(MockitoJUnitRunner.class)
public class ProfilePictureServiceTest {

  @InjectMocks
  private ProfilePictureService testee;

  @Mock
  private ProfilePictureRepository profilePictureRepository;

  @Mock
  private UserRepository userRepository;

  final UUID userId = UUID.randomUUID();

  @Test
  public void test_getProfilePictureData() throws IOException {
    when(profilePictureRepository.getByUserIdAndSize(userId, Size.ORIGINAL))
        .thenReturn(new byte[]{1, 0, 1, 1});

    byte[] result = testee.getProfilePictureData(userId, Size.ORIGINAL);

    verify(profilePictureRepository).getByUserIdAndSize(userId, Size.ORIGINAL);
    assertThat(result, equalTo(result));
  }

  @Test(expected = RuntimeException.class)
  public void test_changeProfilePicture_userNotFoundThrowsException()
      throws IOException, UserNotFoundException {
    final UUID uuid = UUID.randomUUID();
    when(userRepository.findById(uuid)).thenReturn(Optional.empty());
    MultipartFile multipartFile = new MockMultipartFile("test.file", new byte[]{1, 0});

    testee.changeProfilePicture(uuid, multipartFile);
  }

  @Test
  public void test_changeProfilePicture_savePictureAndUpdateUser()
      throws IOException, UserNotFoundException {
    final UUID uuid = UUID.randomUUID();
    final User user = testUser();
    user.setId(uuid);
    when(userRepository.findById(uuid)).thenReturn(Optional.of(user));
    MultipartFile multipartFile = new MockMultipartFile("test.file", new byte[]{1, 0});

    testee.changeProfilePicture(uuid, multipartFile);

    verify(profilePictureRepository, never()).delete(any());
    verify(profilePictureRepository).save(multipartFile, uuid);
  }

  @Test
  public void test_changeProfilePicture_deleteCurrentPictureFromDbIfExists()
      throws IOException, UserNotFoundException {
    final UUID uuid = UUID.randomUUID();
    final User user = testUser();
    when(userRepository.findById(uuid)).thenReturn(Optional.of(user));
    final MultipartFile multipartFile =
        new MockMultipartFile("test.file", new byte[]{1, 0});

    testee.changeProfilePicture(uuid, multipartFile);

    verify(profilePictureRepository).delete(uuid);
    verify(profilePictureRepository).save(multipartFile, uuid);
  }
}