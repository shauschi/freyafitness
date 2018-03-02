package freya.fitness.service;

import freya.fitness.controller.CourseDto;
import freya.fitness.domain.Course;
import freya.fitness.domain.CourseDtoToCourseMapper;
import freya.fitness.domain.User;
import freya.fitness.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class CourseService {

  private CourseRepository courseRepository;

  private CourseDtoToCourseMapper courseDtoToCourseMapper;

  public CourseService(final CourseRepository courseRepository
      , final CourseDtoToCourseMapper courseDtoToCourseMapper) {
    this.courseRepository = courseRepository;
    this.courseDtoToCourseMapper = courseDtoToCourseMapper;
  }

  public Optional<Course> getCourse(final Long id) {
    return courseRepository.findById(id);
  }

  public List<Course> getCoursesFrom(final LocalDate from) {
    return courseRepository.findByStartGreaterThanEqual(from.atStartOfDay());
  }

  public List<Course> getCourses(final LocalDate from, final LocalDate to) {
    return courseRepository.findByStartBetween(from.atStartOfDay(), to.atTime(23, 59, 59));
  }

  public Course update(Course course) {
    return courseRepository.save(course);
  }

  public Course update(CourseDto courseDto) {
    Course existingCourse = getCourse(courseDto.getId()).orElse(null);
    Course course = courseDtoToCourseMapper.apply(courseDto, existingCourse);
    return update(course);
  }

  public Course addUserToCourse(User user, Long courseId) {
    Optional<Course> courseOpt = getCourse(courseId);
    if (courseOpt.isPresent()) {
      Course course = courseOpt.get();
      course.getAttendees().add(user);
      return update(course);
    }
    return null;
  }

  public Course removeUserFromCourse(User user, Long courseId) {
    Optional<Course> courseOpt = getCourse(courseId);
    if (courseOpt.isPresent()) {
      Course course = courseOpt.get();
      course.getAttendees().remove(user);
      return update(course);
    }
    return null;
  }
}
