package freya.fitness.service;

import com.google.common.collect.Sets;
import freya.fitness.TestUtils;
import freya.fitness.domain.jpa.User;
import freya.fitness.domain.jpa.UserPreference;
import freya.fitness.repository.jpa.UserPreferencesRepository;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class UserPreferencesServiceTest {

  @InjectMocks
  private UserPreferencesService testee;

  @Mock
  private UserPreferencesRepository userPreferencesRepository;
  private UUID testUserId;
  private List<UserPreference> testUserPreferences;

  @Before
  public void setUp() {
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
  public void getUserPreferences() {
    List<UserPreference> preferences = testee.getUserPreferences(testUserId);

    assertThat(preferences).hasSize(testUserPreferences.size());
  }

  @Test
  public void saveIsPassedToRepository() {
    UserPreference preference = new UserPreference();
    preference.setUser(TestUtils.testUser());
    preference.setKey("FOO");
    preference.setValue("BAR");

    UserPreference result = testee.save(preference);

    assertThat(result).isNotNull();
    verify(userPreferencesRepository).save(any(UserPreference.class));
  }

  @Test
  public void checkUserPreferences() {
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