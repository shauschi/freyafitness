package freya.fitness.service;

import freya.fitness.TestUtils;
import freya.fitness.domain.jpa.Course;
import freya.fitness.domain.jpa.Membership;
import freya.fitness.domain.jpa.Participation;
import freya.fitness.domain.jpa.User;
import freya.fitness.repository.jpa.ParticipationRepository;
import freya.fitness.utils.exception.MembershipException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;
import java.util.UUID;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import static freya.fitness.TestUtils.givenMembership;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class ParticipationServiceTest {

  @InjectMocks
  private ParticipationService testee;

  @Mock
  private CourseService courseService;

  @Mock
  private MembershipService membershipService;

  @Mock
  private ParticipationRepository participationRepository;

  @Test
  public void shouldCallRepositoryMethodForCount() {
    // given
    final Membership membership = new Membership();
    when(participationRepository.countByMembership(membership)).thenReturn(-1L);

    // when
    final Long result = testee.getParticipationCount(membership);

    // then
    assertThat(result, is(-1L));
    verify(participationRepository).countByMembership(membership);
  }

  @Test
  public void shouldNotHaveFreeCapacityForNull() {
    // when
    boolean result = testee.hasFreeCapacityOnMembership(null);

    // then
    assertThat(result, is(false));
  }

  @Test
  public void shouldNotHaveFreeCapacityForInvalidMembership() {
    // given
    final Membership membership = givenMembership(false, -1);

    // when
    boolean result = testee.hasFreeCapacityOnMembership(membership);

    // then
    assertThat(result, is(false));
  }

  @Test
  public void shouldNotHaveFreeCapacityForMembershipWithoutType() {
    // given
    final Membership membership = mock(Membership.class);
    when(membership.isValid(any())).thenReturn(true);

    // when
    boolean result = testee.hasFreeCapacityOnMembership(membership);

    // then
    assertThat(result, is(false));
  }

  @Test
  public void shouldHaveFreeCapacityForMembershipWithUnlimitedParticipations() {
    // given
    final Membership membership = givenMembership(true, -1);

    // when
    boolean result = testee.hasFreeCapacityOnMembership(membership);

    // then
    assertThat(result, is(true));
    verify(participationRepository, never()).countByMembership(any());
  }

  @Test
  public void shouldHaveFreeCapacityForMembershipWithFreeParticipations() {
    // given
    final Membership membership = givenMembership(true, 10);
    when(participationRepository.countByMembership(membership)).thenReturn(9L);

    // when
    boolean result = testee.hasFreeCapacityOnMembership(membership);

    // then
    assertThat(result, is(true));
    verify(participationRepository).countByMembership(membership);
  }

  @Test
  public void shouldNotHaveFreeCapacityForMembershipWhenParticipationsIsEqualToMax() {
    // given
    final Membership membership = givenMembership(true, 10);
    when(participationRepository.countByMembership(membership)).thenReturn(10L);

    // when
    boolean result = testee.hasFreeCapacityOnMembership(membership);

    // then
    assertThat(result, is(false));
    verify(participationRepository).countByMembership(membership);
  }

  @Test
  public void shouldNotDoAnythingOnRemoveWhenNoParticipationIsFound() {
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
  public void shouldCallDeleteOnRemoveUserFromCourse() {
    // given
    final UUID userId = UUID.randomUUID();
    final UUID courseId = UUID.randomUUID();
    final Participation participation = new Participation();
    when(participationRepository.findByMembershipUserIdAndCourseId(userId, courseId))
        .thenReturn(Optional.of(participation));
    final Course course = mock(Course.class);
    when(course.getParticipantions()).thenReturn(new HashSet<>());
    when(courseService.getCourse(courseId)).thenReturn(course);

    // when
    testee.removeUserFromCourse(userId, courseId);

    // then
    verify(participationRepository).findByMembershipUserIdAndCourseId(userId, courseId);
    verify(participationRepository).delete(participation);
  }

  @Test
  public void shouldCreateNewParticipationEntity() {
    // given
    final UUID userId = UUID.randomUUID();
    final User user = new User();
    user.setId(userId);
    final Membership membership = new Membership();
    membership.setUser(user);
    final UUID courseId = UUID.randomUUID();
    final Course course = mock(Course.class);
    when(course.getParticipantions()).thenReturn(new HashSet<>());
    when(courseService.getCourse(courseId)).thenReturn(course);
    when(courseService.save(any())).thenAnswer(TestUtils.returnFirstArgument);

    // when
    final Course result = testee.addUserToCourse(membership, courseId);

    // then
    assertThat(result, notNullValue());
    assertThat(result.getParticipantions().size(), is(1));
    verify(courseService).getCourse(courseId);
  }

}