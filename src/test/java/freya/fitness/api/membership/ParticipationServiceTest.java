package freya.fitness.api.membership;

import freya.fitness.api.course.Course;
import freya.fitness.api.course.CourseService;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import static freya.fitness.TestUtils.givenMembership;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class})
@MockitoSettings(strictness = Strictness.LENIENT)
class ParticipationServiceTest {

  @InjectMocks
  private ParticipationService testee;

  @Mock
  private CourseService courseService;

  @Mock
  private MembershipService membershipService;

  @Mock
  private ParticipationRepository participationRepository;

  @Test
  void shouldCallRepositoryMethodForCount() {
    // given
    final Membership membership = new Membership();
    when(participationRepository.countParticipationsForMembership(eq(membership), any())).thenReturn(-1L);

    // when
    final Long result = testee.getParticipationCount(membership);

    // then
    assertThat(result).isEqualTo(-1L);
    verify(participationRepository).countParticipationsForMembership(eq(membership), any());
  }

  @Test
  void shouldNotHaveFreeCapacityForNull() {
    // when
    boolean result = testee.hasFreeCapacityOnMembership(null);

    // then
    assertThat(result).isFalse();
  }

  @Test
  void shouldNotHaveFreeCapacityForInvalidMembership() {
    // given
    final Membership membership = givenMembership(false, -1);

    // when
    boolean result = testee.hasFreeCapacityOnMembership(membership);

    // then
    assertThat(result).isFalse();
  }

  @Test
  void shouldNotHaveFreeCapacityForMembershipWithoutType() {
    // given
    final Membership membership = mock(Membership.class);
    when(membership.isValid(any())).thenReturn(true);

    // when
    boolean result = testee.hasFreeCapacityOnMembership(membership);

    // then
    assertThat(result).isFalse();
  }

  @Test
  void shouldHaveFreeCapacityForMembershipWithUnlimitedParticipations() {
    // given
    final Membership membership = givenMembership(true, -1);

    // when
    boolean result = testee.hasFreeCapacityOnMembership(membership);

    // then
    assertThat(result).isTrue();
    verify(participationRepository, never()).countParticipationsForMembership(any(), any());
  }

  @Test
  void shouldHaveFreeCapacityForMembershipWithFreeParticipations() {
    // given
    final Membership membership = givenMembership(true, 10);
    when(participationRepository.countParticipationsForMembership(eq(membership), any())).thenReturn(9L);

    // when
    boolean result = testee.hasFreeCapacityOnMembership(membership);

    // then
    assertThat(result).isTrue();
    verify(participationRepository).countParticipationsForMembership(eq(membership), any());
  }

  @Test
  void shouldNotHaveFreeCapacityForMembershipWhenParticipationsIsEqualToMax() {
    // given
    final Membership membership = givenMembership(true, 10);
    when(participationRepository.countParticipationsForMembership(eq(membership), any())).thenReturn(10L);

    // when
    boolean result = testee.hasFreeCapacityOnMembership(membership);

    // then
    assertThat(result).isFalse();
    verify(participationRepository).countParticipationsForMembership(eq(membership), any());
  }

  @Test
  void shouldNotDoAnythingOnRemoveWhenNoParticipationIsFound() {
    // given
    final UUID userId = UUID.randomUUID();
    final UUID courseId = UUID.randomUUID();
    when(participationRepository.findByMembershipUserIdAndCourseId(userId, courseId))
        .thenReturn(Optional.empty());

    // when
    testee.removeUserFromCourse(userId, courseId);

    // then
    verify(participationRepository).findByMembershipUserIdAndCourseId(userId, courseId);
    verify(participationRepository, never()).delete(any());
  }

  @Test
  void shouldUpdateParticipation() {
    // given
    final UUID userId = UUID.randomUUID();
    final UUID courseId = UUID.randomUUID();
    final Participation participation = new Participation();
    when(participationRepository.findByMembershipUserIdAndCourseId(userId, courseId))
        .thenReturn(Optional.of(participation));
    final Course course = new Course();
    course.setId(courseId);
    course.setMaxParticipants(10);
    when(courseService.getCourse(courseId)).thenReturn(course);

    // when
    testee.removeUserFromCourse(userId, courseId);

    // then
    verify(participationRepository).findByMembershipUserIdAndCourseId(userId, courseId);
    verify(participationRepository).save(any());
  }

}
