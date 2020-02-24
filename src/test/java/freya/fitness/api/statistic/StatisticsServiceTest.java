package freya.fitness.api.statistic;

import freya.fitness.api.course.Course;
import freya.fitness.api.course.CourseType;
import freya.fitness.api.membership.Participation;
import freya.fitness.api.membership.ParticipationService;
import freya.fitness.api.user.User;
import freya.fitness.api.user.UserPreference;
import freya.fitness.api.user.UserPreferencesService;
import freya.fitness.api.user.UserService;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Month;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.internal.util.collections.Sets;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.security.access.AccessDeniedException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatExceptionOfType;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class})
@MockitoSettings(strictness = Strictness.LENIENT)
class StatisticsServiceTest {

  private static final UUID CURRENT_USER_ID = UUID.fromString("8cb8f839-ad40-481f-b1b5-d4d6ff646d6c");
  private static final UUID USER_ID = UUID.fromString("8ee055a8-eb9a-4802-9cbc-1ec354bee77c");

  private static final String EASY = "EASY";
  private static final String MED = "MED";
  private static final UUID EASY_ID = UUID.fromString("1c063819-c050-4a85-af00-3eae6bb58134");
  private static final UUID MED_ID = UUID.fromString("f7e2e7c0-9b6b-44c4-a7af-f8abbad50f75");
  private static final Map<String, UUID> COURSE_TYPE_ID = new HashMap<>();

  private User user = null;

  @InjectMocks
  private StatisticsService testee;

  @Mock
  private UserService userService;

  @Mock
  private ParticipationService participationService;

  @Mock
  private UserPreferencesService userPreferencesService;

  @BeforeEach
  void setUp() {
    COURSE_TYPE_ID.put(EASY, EASY_ID);
    COURSE_TYPE_ID.put(MED, MED_ID);

    // given current user
    final User currentUser = new User();
    currentUser.setId(CURRENT_USER_ID);
    when(userService.getCurrentUser()).thenReturn(currentUser);

    // given user
    user = new User();
    user.setId(USER_ID);
    final UserPreference preference = new UserPreference();
    preference.setKey(UserPreference.VIEW_STATISTICS);
    preference.setValue("true");
    user.setPreferences(Sets.newSet(preference));
    when(userService.getUser(USER_ID)).thenReturn(user);

    when(userPreferencesService.checkUserPreferences(any(), any(), any())).thenCallRealMethod();
  }

  @Test
  void shouldDenyAccessWhenNoUserIsSignedIn() {
    when(userService.getCurrentUser()).thenReturn(null);

    assertThatExceptionOfType(AccessDeniedException.class).isThrownBy(
        () -> testee.getUserStats(USER_ID)
    );
  }

  @Test
  void shouldDenyAccessWhenUserWantsPrivacy() {
    user.setPreferences(Collections.emptySet());

    assertThatExceptionOfType(AccessDeniedException.class).isThrownBy(
        () -> testee.getUserStats(USER_ID)
    );
  }

  @Test
  void shouldNotCheckForPrivacyWhenUserIsCurrentUser() {
    // given
    user.setPreferences(Collections.emptySet());

    // when
    testee.getUserStats(CURRENT_USER_ID);

    // then
    verify(userPreferencesService, never()).checkUserPreferences(any(), any(), any());
  }

  @Test
  void shouldReturnEmptyStatisticsWhenUserDidNotAttendAnyCourses() {

    // when
    final StatisticDto result = testee.getUserStats(USER_ID);

    // then
    assertThat(result).isNotNull();
    assertThat(result.getUserId()).isEqualTo(USER_ID);
    assertThat(result.getParticipationsPerMonth()).isNotNull();
  }

  @Test
  void shouldMapStatistics() {
    final LocalDateTime now = LocalDateTime.now().minusMonths(1);
    final int year = now.getYear();
    final Month month = now.getMonth();
    // given
    List<Participation> participations = Arrays.asList(
        givenParticipation(LocalDate.of(year, month, 10).minusMonths(4), EASY),
        givenParticipation(LocalDate.of(year, month, 12).minusMonths(4), MED),
        givenParticipation(LocalDate.of(year, month, 15).minusMonths(4), EASY),

        givenParticipation(LocalDate.of(year, month, 15).minusMonths(3), EASY),

        givenParticipation(LocalDate.of(year, month, 17).minusMonths(2), MED),
        givenParticipation(LocalDate.of(year, month, 20).minusMonths(2), MED),

        givenParticipation(LocalDate.of(year, month, 20), MED),
        givenParticipation(LocalDate.of(year, month, 21), MED),
        givenParticipation(LocalDate.of(year, month, 22), EASY),
        givenParticipation(LocalDate.of(year, month, 27), EASY)

    );
    when(participationService.getParticipationsBetween(eq(USER_ID), any(), any()))
        .thenReturn(participations);

    // when
    final StatisticDto result = testee.getUserStats(USER_ID);

    // then
    assertThat(result).isNotNull();
    assertThat(result.getUserId()).isEqualTo(USER_ID);
    assertThat(result.getParticipationsPerType().get(EASY_ID)).isEqualTo(5L);

    final Map<LocalDate, Long> participationsPerMonth = result.getParticipationsPerMonth();
    assertThat(participationsPerMonth).hasSize(5);
    final LocalDate begOfMonth = LocalDate.of(year, month, 1);
    assertThat(participationsPerMonth.get(begOfMonth.minusMonths(4))).isEqualTo(3L);
    assertThat(participationsPerMonth.get(begOfMonth.minusMonths(3))).isEqualTo(1L);
    assertThat(participationsPerMonth.get(begOfMonth.minusMonths(2))).isEqualTo(2L);
    assertThat(participationsPerMonth.get(begOfMonth.minusMonths(1))).isEqualTo(0L);
    assertThat(participationsPerMonth.get(begOfMonth)).isEqualTo(4L);
  }

  private Participation givenParticipation(final LocalDate courseStart, final String courseType) {
    final Participation participation = new Participation();
    final Course course = new Course();
    final CourseType type = new CourseType();
    type.setId(COURSE_TYPE_ID.get(courseType));
    type.setName(courseType);
    course.setType(type);
    course.setStart(LocalDateTime.of(courseStart, LocalTime.of(15, 0, 0)));
    participation.setCourse(course);

    return participation;
  }

}
