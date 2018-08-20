package freya.fitness.api.mapping;

import freya.fitness.api.dto.CourseDto;
import freya.fitness.api.dto.ProfileDto;
import freya.fitness.domain.jpa.Course;
import freya.fitness.domain.jpa.CourseType;
import freya.fitness.domain.jpa.Membership;
import freya.fitness.domain.jpa.Participation;
import freya.fitness.domain.jpa.Role;
import freya.fitness.domain.jpa.User;
import freya.fitness.domain.jpa.UserPreference;
import freya.fitness.repository.jpa.CourseTypeRepository;
import freya.fitness.service.UserPreferencesService;
import freya.fitness.service.UserService;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CourseMapper {

  private final UserService userService;
  private final CourseTypeRepository courseTypeRepository;
  private final ProfileMapper profileMapper;
  private final UserPreferencesService userPreferencesService;

  @Autowired
  public CourseMapper(final UserService userService,
                      final CourseTypeRepository courseTypeRepository,
                      final ProfileMapper profileMapper,
                      final UserPreferencesService userPreferencesService) {
    this.userService = userService;
    this.courseTypeRepository = courseTypeRepository;
    this.profileMapper = profileMapper;
    this.userPreferencesService = userPreferencesService;
  }

  public Course map(final CourseDto courseDto, final Course existingCourse) {
    if (courseDto == null) {
      return null;
    }
    final Course course = Optional.ofNullable(existingCourse).orElseGet(Course::new);

    course.setType(
        courseTypeRepository.findById(courseDto.getCourseTypeId())
        .orElse(null));
    course.setStart(courseDto.getStart());
    course.setMinutes(courseDto.getMinutes());
    // TODO am DTO nur die ID speichern
    final User instructor = userService.getUser(courseDto.getInstructor().getId());
    course.setInstructor(instructor);
    course.setMaxParticipants(courseDto.getMaxParticipants());
    course.setCanceled(courseDto.isCanceled());

    return course;
  }

  public CourseDto map(final Course course) {
    if (course == null) {
      return null;
    }

    final CourseDto dto = new CourseDto();
    dto.setId(course.getId());
    final CourseType type = course.getType();
    dto.setCourseTypeId(type != null ? type.getId() : null);
    dto.setStart(course.getStart());
    dto.setMinutes(course.getMinutes());
    final User instructor = course.getInstructor();
    dto.setInstructor(profileMapper.map(instructor));
    dto.setMaxParticipants(course.getMaxParticipants());
    dto.setCanceled(course.isCanceled());

    final List<ProfileDto> attendees = mapAttendees(course);
    dto.setAttendees(attendees);

    final UUID userId = userService.getCurrentUser().getId();
    boolean signedIn = course.getParticipantions().stream()
        .map(Participation::getMembership)
        .map(Membership::getUser)
        .map(User::getId)
        .anyMatch(Predicate.isEqual(userId));
    dto.setSignedIn(signedIn);

    return dto;
  }

  private List<ProfileDto> mapAttendees(final Course course) {
    final User currentUser = userService.getCurrentUser();
    final UUID currentUserId = currentUser.getId();
    boolean showAll = currentUser.getRoles().stream()
        .map(Role::getAuthority)
        .anyMatch(auth -> "TRAINER".equals(auth) || "ADMIN".equals(auth));

    return course.getParticipantions().stream()
        .sorted(Comparator.comparing(Participation::getSignInTime))
        .map(Participation::getMembership)
        .map(Membership::getUser)
        .map(user -> mapAttendee(user, currentUserId, showAll))
        .collect(Collectors.toList());
  }

  private ProfileDto mapAttendee(final User user, final UUID currentUserId, boolean showAll) {
    if (showAll || currentUserId.equals(user.getId()) || !userWantsPrivacy(user)) {
      return profileMapper.map(user);
    }
    return ProfileDto.Anonymous();
  }

  private boolean userWantsPrivacy(final User user) {
    return !userPreferencesService.checkUserPreferences(
        user,
        UserPreference.VIEW_PARTICIPATION,
        "true");
  }

}
