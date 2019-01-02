package freya.fitness.service;

import freya.fitness.domain.jpa.Course;
import freya.fitness.domain.jpa.Membership;
import freya.fitness.domain.jpa.Participation;
import freya.fitness.domain.jpa.ParticipationStatus;
import freya.fitness.repository.jpa.ParticipationRepository;
import freya.fitness.utils.exception.CourseNotFoundException;
import java.time.LocalDateTime;
import java.util.Comparator;
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

  public List<Participation> getParticipationsBetween(
      final UUID userId, final LocalDateTime from, final LocalDateTime to) {
    return participationRepository.findByMembershipUserIdAndCourseStartBetweenAndParticipationStatus(
            userId, from, to, ParticipationStatus.SIGNED_IN);
  }

  public Long getParticipationCount(final Membership membership) {
    return participationRepository.countParticipationsForMembership(membership, LocalDateTime.now());
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
    final Participation participation = participationRepository
            .findByMembershipUserIdAndCourseId(membership.getUser().getId(), courseId)
            .orElseGet(Participation::new);
    participation.setCourse(course);
    participation.setMembership(membership);
    participation.setParticipationStatus(ParticipationStatus.SIGNED_IN);
    participation.setSignInTime(LocalDateTime.now());
    if (participation.getId() == null) {
      course.getParticipantions().add(participation);
    }
    participationRepository.save(participation);
    updateWaitlist(course);
    return course;
  }

  public Course removeUserFromCourse(final UUID userId, final UUID courseId) {
    final Optional<Participation> existingParticipation =
        participationRepository.findByMembershipUserIdAndCourseId(userId, courseId);
    final Course course = courseService.getCourse(courseId);
    if (existingParticipation.isPresent()) {
      final Participation entity = existingParticipation.get();
      entity.setParticipationStatus(ParticipationStatus.SIGNED_OUT);
      participationRepository.save(entity);
      updateWaitlist(course);
    }

    return course;
  }

  public void updateWaitlist(final Course course) {
    final int max = course.getMaxParticipants();
    final List<Participation> participations = participationRepository.findByCourseId(course.getId());
    participations.sort(Comparator.comparing(Participation::getSignInTime));
    int signedIn = 0;
    for (final Participation participation : participations) {
      switch (participation.getParticipationStatus()) {
        case SIGNED_IN:
          if (signedIn == max) {
            participation.setParticipationStatus(ParticipationStatus.ON_WAITLIST);
          } else {
            signedIn++;
          }
          break;
        case SIGNED_OUT:
          break;
        case ON_WAITLIST:
          if (signedIn < max) {
            signedIn++;
            participation.setParticipationStatus(ParticipationStatus.SIGNED_IN);
          }
          break;
        default:
          if (signedIn == max) {
            participation.setParticipationStatus(ParticipationStatus.ON_WAITLIST);
          } else {
            participation.setParticipationStatus(ParticipationStatus.SIGNED_IN);
            signedIn++;
          }
          break;
      }
    }
    participationRepository.saveAll(participations);
  }

  public List<Participation> getParticipations(final UUID membershipId) {
    return participationRepository.findByMembershipId(membershipId);
  }

  public void deleteParticipation(final UUID id) {
    participationRepository.deleteById(id);
  }
}
