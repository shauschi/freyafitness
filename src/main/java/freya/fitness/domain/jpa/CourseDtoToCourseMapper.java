package freya.fitness.domain.jpa;

import freya.fitness.dto.CourseDto;
import freya.fitness.dto.ProfileDto;
import freya.fitness.repository.jpa.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.function.BiFunction;
import java.util.stream.Collectors;

@Component
public class CourseDtoToCourseMapper implements BiFunction<CourseDto, Course, Course> {

  private final UserRepository userRepository;

  @Autowired
  public CourseDtoToCourseMapper(final UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public Course apply(CourseDto courseDto, Course existingCourse) {
    if (courseDto == null) {
      return null;
    }
    final Course course = Optional.ofNullable(existingCourse).orElseGet(Course::new);

    course.setType(courseDto.getType());
    course.setStart(courseDto.getStart());
    course.setMinutes(courseDto.getMinutes());
    // TODO am DTO nur die ID speichern
    final User instructor = userRepository.findById(
        courseDto.getInstructor().getId()).orElse(null);
    course.setInstructor(instructor);
    course.setMaxParticipants(courseDto.getMaxParticipants());
    course.setCanceled(courseDto.isCanceled());
    // TODO am DTO nur die IDs speichern
    final List<User> attendees = courseDto.getAttendees().stream()
        .map(ProfileDto::getId)
        .map(userRepository::findById)
        .filter(Optional::isPresent)
        .map(Optional::get)
        .collect(Collectors.toList());
    course.setAttendees(attendees);

    return course;
  }
}
