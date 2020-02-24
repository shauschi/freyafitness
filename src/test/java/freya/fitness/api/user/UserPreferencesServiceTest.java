package freya.fitness.api.user;

import com.google.common.collect.Sets;
import freya.fitness.TestUtils;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class})
@MockitoSettings(strictness = Strictness.LENIENT)
class UserPreferencesServiceTest {

  @InjectMocks
  private UserPreferencesService testee;

  @Mock
  private UserPreferencesRepository userPreferencesRepository;
  private UUID testUserId;
  private List<UserPreference> testUserPreferences;

  @BeforeEach
  void setUp() {
    testUserId = UUID.randomUUID();
    UserPreference preference1 = new UserPreference();
    preference1.setKey("FOO");
    preference1.setValue("BAR");
    UserPreference preference2 = new UserPreference();
    preference2.setKey("HELLO");
    preference2.setValue("WORLD");
    testUserPreferences = Arrays.asList(preference1, preference2);

    when(userPreferencesRepository.findByUserId(testUserId))
        .thenReturn(testUserPreferences);
    when(userPreferencesRepository.save(any()))
        .thenAnswer(answer -> answer.getArgument(0));
  }

  @Test
  void getUserPreferences() {
    List<UserPreference> preferences = testee.getUserPreferences(testUserId);

    assertThat(preferences).hasSize(testUserPreferences.size());
  }

  @Test
  void saveIsPassedToRepository() {
    UserPreference preference = new UserPreference();
    preference.setUser(TestUtils.testUser());
    preference.setKey("FOO");
    preference.setValue("BAR");

    UserPreference result = testee.save(preference);

    assertThat(result).isNotNull();
    verify(userPreferencesRepository).save(any(UserPreference.class));
  }

  @Test
  void checkUserPreferences() {
    UserPreference preference1 = new UserPreference();
    preference1.setKey("FOO");
    preference1.setValue("true");
    UserPreference preference2 = new UserPreference();
    preference2.setKey("HELLO");
    preference2.setValue("WORLD");
    User user = TestUtils.testUser();
    user.setPreferences(Sets.newHashSet(preference1, preference2));

    boolean result = testee.checkUserPreferences(user, "FOO", "true");

    assertThat(result).isTrue();
  }

}
