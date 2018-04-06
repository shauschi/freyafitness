package freya.fitness.service;

import freya.fitness.domain.jpa.User;
import freya.fitness.repository.jpa.UserRepository;
import freya.fitness.repository.mongodb.ProfilePictureRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

import static freya.fitness.TestUtils.testUser;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.argThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class ProfilePictureServiceTest {

  @InjectMocks
  private ProfilePictureService testee;

  @Mock
  private ProfilePictureRepository profilePictureRepository;

  @Mock
  private UserRepository userRepository;

  @Test
  public void test_getProfilePictureData() throws IOException {
    final String pictureId = "pictureId";
    when(profilePictureRepository.getById(pictureId))
        .thenReturn(new byte[]{1, 0, 1, 1});

    byte[] result = testee.getProfilePictureData(pictureId);

    verify(profilePictureRepository).getById(pictureId);
    assertThat(result, equalTo(result));
  }

  @Test(expected = RuntimeException.class)
  public void test_changeProfilePicture_userNotFoundThrowsException()
      throws IOException {
    final Long userId = 123_456L;
    when(userRepository.findById(userId)).thenReturn(Optional.empty());
    MultipartFile multipartFile = new MockMultipartFile("test.file", new byte[]{1, 0});

    testee.changeProfilePicture(userId, multipartFile);
  }

  @Test
  public void test_changeProfilePicture_savePictureAndUpdateUser()
      throws IOException {
    final Long userId = 123_456L;
    final User user = testUser();
    when(userRepository.findById(userId)).thenReturn(Optional.of(user));
    when(profilePictureRepository.save(any())).thenReturn("SAVED");
    MultipartFile multipartFile = new MockMultipartFile("test.file", new byte[]{1, 0});

    testee.changeProfilePicture(userId, multipartFile);

    verify(profilePictureRepository, never()).delete(any());
    verify(profilePictureRepository).save(multipartFile);
    verify(userRepository).save(
        argThat(savedUser -> "SAVED".equals(savedUser.getProfilePictureId())));
  }

  @Test
  public void test_changeProfilePicture_deleteCurrentPictureFromDbIfExists()
      throws IOException {
    final Long userId = 123_456L;
    final User user = testUser();
    user.setProfilePictureId("OLD_PIC");
    when(userRepository.findById(userId)).thenReturn(Optional.of(user));
    when(profilePictureRepository.save(any())).thenReturn("SAVED");
    final MultipartFile multipartFile =
        new MockMultipartFile("test.file", new byte[]{1, 0});

    testee.changeProfilePicture(userId, multipartFile);

    verify(profilePictureRepository).delete("OLD_PIC");
    verify(profilePictureRepository).save(multipartFile);
    verify(userRepository).save(
        argThat(savedUser -> "SAVED".equals(savedUser.getProfilePictureId())));
  }
}