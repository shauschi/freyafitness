package freya.fitness.api.course;

import freya.fitness.api.membership.ParticipationRepository;
import freya.fitness.api.user.User;
import freya.fitness.utils.exception.CourseNotFoundException;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import static freya.fitness.utils.TimeUtils.nextFullHour;


@Service
public class CourseService {

  @Value("${course.create.minutes: 60}")
  private int minutes;

  @Value("${course.create.maxParticipants: 12}")
  private int maxParticipants;

  private final CourseRepository courseRepository;
  private final CourseMapper courseDtoToCourseMapper;
  private final ParticipationRepository participationRepository;

  @Autowired
  public CourseService(
      final CourseRepository courseRepository,
      final CourseMapper courseDtoToCourseMapper,
      final ParticipationRepository participationRepository) {
    this.courseRepository = courseRepository;
    this.courseDtoToCourseMapper = courseDtoToCourseMapper;
    this.participationRepository = participationRepository;
  }

  @Transactional(propagation = Propagation.REQUIRES_NEW)
  public Course getCourse(final UUID id) throws CourseNotFoundException {
    return courseRepository.findById(id).orElseThrow(() -> CourseNotFoundException.withId(id));
  }

  public List<Course> getCoursesFrom(final LocalDate from) {
    return courseRepository.findByStartGreaterThanEqual(from.atStartOfDay());
  }

  public List<Course> getCourses(final LocalDate from, final LocalDate to) {
    return courseRepository.findByStartBetween(from.atStartOfDay(), to.atTime(23, 59, 59));
  }

  public Course save(Course course) {
    if (course == null) {
      return null;
    }
    return courseRepository.save(course);
  }

  public Course update(final UUID courseId, final CourseDto courseDto) throws CourseNotFoundException {
    final Course existingCourse = courseId == null ? null : getCourse(courseId);
    final Course course = courseDtoToCourseMapper.map(courseDto, existingCourse);
    return save(course);
  }

  @Transactional
  public void delete(final UUID courseId) {
    participationRepository.deleteByCourseId(courseId);
    courseRepository.deleteById(courseId);
  }

  public Course create(final CourseDto courseDto) {
    final Course course = courseDtoToCourseMapper.map(courseDto, null);
    return save(course);
  }

  public Course createEmptyCourse(final User user) {
    final Course course = new Course();
    course.setInstructor(user);
    course.setMinutes(minutes);
    course.setStart(nextFullHour());
    course.setMaxParticipants(maxParticipants);
    course.setCanceled(false);
    return course;
  }

}
