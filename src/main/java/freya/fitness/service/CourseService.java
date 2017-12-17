package freya.fitness.service;

import freya.fitness.domain.Course;
import freya.fitness.domain.CourseType;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Service
public class CourseService {

  private Map<Long, Course> courses;

  public CourseService() {
    courses = new HashMap<>();
    final LocalDate date = LocalDate.now();
    mock(100L, date, LocalTime.of(17, 30), CourseType.SOFT);
    mock(101L, date, LocalTime.of(18, 30), CourseType.NORMAL);
    mock(102L, date, LocalTime.of(19, 30), CourseType.NORMAL);
    mock(103L, date, LocalTime.of(20, 30), CourseType.HARD);
    mock(104L, date.plusDays(1), LocalTime.of(18, 30), CourseType.SOFT);
    mock(105L, date.plusDays(1), LocalTime.of(19, 30), CourseType.SOFT);
    mock(106L, date.plusDays(1), LocalTime.of(20, 30), CourseType.NORMAL);
    mock(107L, date.plusDays(3), LocalTime.of(19, 30), CourseType.SOFT);
    mock(108L, date.plusDays(3), LocalTime.of(20, 30), CourseType.NORMAL);
    mock(109L, date.plusDays(7), LocalTime.of(18, 30), CourseType.SOFT);
    mock(110L, date.plusDays(7), LocalTime.of(19, 30), CourseType.NORMAL);
    mock(111L, date.plusDays(7), LocalTime.of(20, 30), CourseType.HARD);
  }

  public Optional<Course> getCourse(final Long id) {
    return Optional.of(courses.get(id)); // repository liefert später auch ein Optional
  }

  public List<Course> getCourses(final LocalDate date, final LocalDate to) {
    return new ArrayList<>(courses.values());
  }

  private void mock(Long id, LocalDate date, LocalTime start, CourseType type) {
    final Course course = new Course();
    course.setId(id);
    course.setInstructor("Freya");
    course.setStart(LocalDateTime.of(date, start));
    course.setMinutes(60L);
    course.setType(type);
    List<String> attendees = Arrays.asList("Stefan, Viviane, Freya, Trutz");
    course.setAttendees(attendees);
    courses.put(id, course);
  }
}
