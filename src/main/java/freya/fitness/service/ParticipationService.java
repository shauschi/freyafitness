package freya.fitness.service;

import freya.fitness.domain.jpa.Course;
import freya.fitness.domain.jpa.Membership;
import freya.fitness.domain.jpa.Participation;
import freya.fitness.repository.jpa.ParticipationRepository;
import freya.fitness.utils.exception.CourseNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ParticipationService {

  private static final int UNLIMITED_PARTICIPATIONS = -1;

  private final CourseService courseService;
  private final ParticipationRepository participationRepository;

  @Autowired
  public ParticipationService(final CourseService courseService,
                              final ParticipationRepository participationRepository) {
    this.courseService = courseService;
    this.participationRepository = participationRepository;
  }

  public List<Participation> getParticipationsSince(final UUID userId, final LocalDateTime since) {
    return participationRepository
        .findByMembershipUserIdAndCourseStartGreaterThanEqual(userId, since);
  }

  public Long getParticipationCount(final Membership membership) {
    return participationRepository.countByMembership(membership);
  }

  public boolean hasFreeCapacityOnMembership(final Membership membership) {
    return this.hasFreeCapacityOnMembership(membership, LocalDateTime.now());
  }

  public boolean hasFreeCapacityOnMembership(
      final Membership membership, final LocalDateTime dateTime) {
    if (membership == null || !membership.isValid(dateTime) || membership.getType() == null) {
      return false;
    }
    int max = membership.getType().getMaxParticipations();
    if (max == UNLIMITED_PARTICIPATIONS) {
      return true;
    }
    return getParticipationCount(membership) < max;
  }

  public Course addUserToCourse(final Membership membership, final UUID courseId)
      throws CourseNotFoundException {
    final Course course = courseService.getCourse(courseId);
    final Optional<Participation> existingParticipation =
        participationRepository.findByMembershipUserIdAndCourseId(
            membership.getUser().getId(), courseId);
    if (existingParticipation.isPresent()) {
      return course;
    }

    final Participation participation = new Participation();
    participation.setCourse(course);
    participation.setMembership(membership);
    participation.setSignInTime(LocalDateTime.now());

    course.getParticipantions().add(participation);
    participationRepository.save(participation);
    return courseService.save(course);
  }

  public Course removeUserFromCourse(final UUID userId, final UUID courseId) {
    final Course course = courseService.getCourse(courseId);
    final Optional<Participation> existingParticipation =
        participationRepository.findByMembershipUserIdAndCourseId(userId, courseId);
    if (existingParticipation.isPresent()) {
      final Participation entity = existingParticipation.get();
      course.getParticipantions().remove(entity);
      participationRepository.delete(entity);
      return courseService.save(course);
    }
    return course;
  }

}
