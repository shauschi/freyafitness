package freya.fitness.domain;

import freya.fitness.controller.CourseDto;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.function.BiFunction;

@Component
public class CourseDtoToCourseMapper implements BiFunction<CourseDto, Course, Course> {

  public Course apply(CourseDto courseDto) {
    return this.apply(courseDto, null);
  }

  @Override
  public Course apply(CourseDto courseDto, Course existingCourse) {

    if (courseDto == null) {
      return null;
    }
    Course course = Optional.ofNullable(existingCourse).orElseGet(Course::new);

    course.setType(courseDto.getType());
    course.setStart(courseDto.getStart());
    course.setMinutes(courseDto.getMinutes());
    // TODO
    // course.setInstructor(courseDto.getInstructorId());
    course.setMaxParticipants(courseDto.getMaxParticipants());
    course.setCanceled(courseDto.isCanceled());
    // TODO
    //course.setAttendees(courseDto.getAttendees());

    return course;
  }
}
