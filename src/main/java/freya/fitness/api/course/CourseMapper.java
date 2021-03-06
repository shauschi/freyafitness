package freya.fitness.api.course;

import freya.fitness.api.common.ProfileDto;
import freya.fitness.api.membership.Membership;
import freya.fitness.api.membership.Participation;
import freya.fitness.api.membership.ParticipationStatus;
import freya.fitness.api.user.ProfileMapper;
import freya.fitness.api.user.Role;
import freya.fitness.api.user.User;
import freya.fitness.api.user.UserPreference;
import freya.fitness.api.user.UserPreferencesService;
import freya.fitness.api.user.UserService;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
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
        courseTypeRepository.findById(courseDto.getCourseType().getId())
        .orElse(null));
    course.setStart(courseDto.getStart());
    course.setMinutes(courseDto.getMinutes());
    final User instructor = userService.getUser(courseDto.getInstructor().getId());
    course.setInstructor(instructor);
    course.setMaxParticipants(courseDto.getMaxParticipants());
    course.setCanceled(courseDto.isCanceled());
    course.setText(courseDto.getText());

    return course;
  }

  public CourseOverviewDto map(final Course course, final Participation participation) {
    if (course == null) {
      return null;
    }

    final CourseOverviewDto dto = new CourseOverviewDto();
    dto.setId(course.getId());
    final CourseType type = course.getType();
    dto.setCourseType(type != null ? new CourseTypeDto(type) : new CourseTypeDto());
    dto.setStart(course.getStart());
    dto.setParticipationStatus(participation.getParticipationStatus());

    return dto;
  }

  public CourseDto map(final Course course) {
    if (course == null) {
      return null;
    }

    final CourseDto dto = new CourseDto();
    dto.setId(course.getId());
    final CourseType type = course.getType();
    dto.setCourseType(type != null ? new CourseTypeDto(type) : new CourseTypeDto());
    dto.setStart(course.getStart());
    dto.setMinutes(course.getMinutes());
    final User instructor = course.getInstructor();
    dto.setInstructor(profileMapper.map(instructor));
    dto.setMaxParticipants(course.getMaxParticipants());
    dto.setCanceled(course.isCanceled());

    final List<ProfileDto> attendees = mapAttendees(course);
    dto.setAttendees(attendees);

    final UUID userId = userService.getCurrentUser().getId();
    final ParticipationStatus status = course.getParticipantions().stream()
        .filter(p -> p.getMembership().getUser().getId().equals(userId))
        .map(Participation::getParticipationStatus)
        .filter(Objects::nonNull)
        .findFirst()
        .orElse(null);
    dto.setParticipationStatus(status);
    dto.setText(course.getText());

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
        .filter(this::isSignedInOrOnWaitlist)
        .map(Participation::getMembership)
        .map(Membership::getUser)
        .map(user -> mapAttendee(user, currentUserId, showAll))
        .collect(Collectors.toList());
  }

  private boolean isSignedInOrOnWaitlist(final Participation participation) {
    return participation.getParticipationStatus() == ParticipationStatus.SIGNED_IN
        || participation.getParticipationStatus() == ParticipationStatus.ON_WAITLIST;
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
