package freya.fitness.api.mapping;

import freya.fitness.api.dto.CourseDto;
import freya.fitness.api.dto.ProfileDto;
import freya.fitness.domain.jpa.Course;
import freya.fitness.domain.jpa.User;
import freya.fitness.repository.jpa.CourseTypeRepository;
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

  private final CourseTypeRepository courseTypeRepository;

  @Autowired
  public CourseDtoToCourseMapper(final UserRepository userRepository,
                                 final CourseTypeRepository courseTypeRepository) {
    this.userRepository = userRepository;
    this.courseTypeRepository = courseTypeRepository;
  }

  @Override
  public Course apply(CourseDto courseDto, Course existingCourse) {
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
    final User instructor = userRepository.findById(
        courseDto.getInstructor().getId()).orElse(null);
    course.setInstructor(instructor);
    course.setMaxParticipants(courseDto.getMaxParticipants());
    course.setCanceled(courseDto.isCanceled());

    return course;
  }
}
