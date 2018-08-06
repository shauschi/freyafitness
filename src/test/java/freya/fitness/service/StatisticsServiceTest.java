package freya.fitness.service;

import freya.fitness.api.dto.StatisticDto;
import freya.fitness.domain.jpa.Course;
import freya.fitness.domain.jpa.CourseType;
import freya.fitness.domain.jpa.Participation;
import freya.fitness.domain.jpa.User;
import freya.fitness.domain.jpa.UserPreference;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.internal.util.collections.Sets;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.security.access.AccessDeniedException;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class StatisticsServiceTest {

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

  @Rule
  public ExpectedException expectedException = ExpectedException.none();

  @Before
  public void setUp() {
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
  public void shouldDenyAccessWhenNoUserIsSignedIn() {
    expectedException.expect(AccessDeniedException.class);

    // given
    when(userService.getCurrentUser()).thenReturn(null);

    // when
    testee.getUserStats(USER_ID);

    // then
    // see expected exception
  }

  @Test
  public void shouldDenyAccessWhenUserWantsPrivacy() {
    expectedException.expect(AccessDeniedException.class);

    // given
    user.setPreferences(Collections.emptySet());

    // when
    testee.getUserStats(USER_ID);

    // then
    // see expected exception
  }

  @Test
  public void shouldNotCheckForPrivacyWhenUserIsCurrentUser() {
    // given
    user.setPreferences(Collections.emptySet());

    // when
    testee.getUserStats(CURRENT_USER_ID);

    // then
    verify(userPreferencesService, never()).checkUserPreferences(any(), any(), any());
  }

  @Test
  public void shouldReturnEmptyStatisticsWhenUserDidNotAttendAnyCourses() {

    // when
    final StatisticDto result = testee.getUserStats(USER_ID);

    // then
    assertThat(result, notNullValue());
    assertThat(result.getUserId(), is(USER_ID));
    assertThat(result.getParticipationsPerMonth(), notNullValue());
  }

  @Test
  public void shouldMapStatistics() {
    // given
    List<Participation> participations = Arrays.asList(
        givenParticipation(LocalDate.of(2018, 3, 10), EASY),
        givenParticipation(LocalDate.of(2018, 3, 12), MED),
        givenParticipation(LocalDate.of(2018, 3, 15), EASY),

        givenParticipation(LocalDate.of(2018, 4, 15), EASY),

        givenParticipation(LocalDate.of(2018, 5, 17), MED),
        givenParticipation(LocalDate.of(2018, 5, 20), MED),

        givenParticipation(LocalDate.of(2018, 7, 20), MED),
        givenParticipation(LocalDate.of(2018, 7, 21), MED),
        givenParticipation(LocalDate.of(2018, 7, 22), EASY),
        givenParticipation(LocalDate.of(2018, 7, 27), EASY)

    );
    when(participationService.getParticipationsBetween(eq(USER_ID), any(), any()))
        .thenReturn(participations);

    // when
    final StatisticDto result = testee.getUserStats(USER_ID);

    // then
    assertThat(result, notNullValue());
    assertThat(result.getUserId(), is(USER_ID));
    assertThat(result.getFavouriteCourseParticipations(), is(5L));
    assertThat(result.getFavouriteCourseTypeId(), is(EASY_ID));

    final Map<LocalDate, Long> participationsPerMonth = result.getParticipationsPerMonth();
    assertThat(participationsPerMonth, notNullValue());
    assertThat(participationsPerMonth.size(), is(5));
    assertThat(
        participationsPerMonth.get(LocalDate.of(2018, 3, 1)), is(3L));
    assertThat(
        participationsPerMonth.get(LocalDate.of(2018, 4, 1)), is(1L));
    assertThat(
        participationsPerMonth.get(LocalDate.of(2018, 5, 1)), is(2L));
    assertThat(
        participationsPerMonth.get(LocalDate.of(2018, 6, 1)), is(0L));
    assertThat(
        participationsPerMonth.get(LocalDate.of(2018, 7, 1)), is(4L));
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