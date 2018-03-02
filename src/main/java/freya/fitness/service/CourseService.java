package freya.fitness.service;

import freya.fitness.domain.jpa.Course;
import freya.fitness.domain.jpa.CourseDtoToCourseMapper;
import freya.fitness.domain.jpa.User;
import freya.fitness.dto.CourseDto;
import freya.fitness.repository.jpa.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static freya.fitness.utils.TimeUtils.nextFullHour;

@Service
public class CourseService {

  @Value("${course.create.minutes: 60}")
  private int minutes;

  @Value("${course.create.maxParticipants: 12}")
  private int maxParticipants;

  private final CourseRepository courseRepository;

  private CourseDtoToCourseMapper courseDtoToCourseMapper;

  @Autowired
  public CourseService(final CourseRepository courseRepository, final CourseDtoToCourseMapper courseDtoToCourseMapper) {
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

  private Course save(Course course) {
    return courseRepository.save(course);
  }

  public Course update(final Long courseId, final CourseDto courseDto) {
    final Course existingCourse = getCourse(courseId).orElse(null);
    final Course course = courseDtoToCourseMapper.apply(courseDto, existingCourse);
    return save(course);
  }

  public Course create(final CourseDto courseDto) {
    final Course course = courseDtoToCourseMapper.apply(courseDto, null);
    return save(course);
  }

  public Course addUserToCourse(User user, Long courseId) {
    final Optional<Course> courseOpt = getCourse(courseId);
    if (courseOpt.isPresent()) {
      final Course course = courseOpt.get();
      course.getAttendees().add(user);
      return save(course);
    }
    return null;
  }

  public Course removeUserFromCourse(User user, Long courseId) {
    final Optional<Course> courseOpt = getCourse(courseId);
    if (courseOpt.isPresent()) {
      final Course course = courseOpt.get();
      course.getAttendees().remove(user);
      return save(course);
    }
    return null;
  }

  public Course createEmptyCourse(User user) {
    final Course course = new Course();
    course.setInstructor(user);
    course.setMinutes(minutes);
    course.setStart(nextFullHour());
    course.setMaxParticipants(maxParticipants);
    course.setAttendees(new ArrayList<>());
    course.setCanceled(false);
    return course;
  }

}
