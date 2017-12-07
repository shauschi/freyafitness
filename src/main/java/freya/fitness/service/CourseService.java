package freya.fitness.service;

import freya.fitness.domain.Course;
import freya.fitness.domain.CourseType;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@Service
public class CourseService {

  public List<Course> getCourses(final LocalDate date, final LocalDate to) {
    final Course c1 = mock(100L, date, LocalTime.of(17, 30), CourseType.SOFT);
    final Course c2 = mock(101L, date, LocalTime.of(18, 30), CourseType.NORMAL);
    final Course c3 = mock(102L, date, LocalTime.of(19, 30), CourseType.NORMAL);
    final Course c4 = mock(103L, date, LocalTime.of(20, 30), CourseType.HARD);
    final Course c5 = mock(103L, date.plusDays(1), LocalTime.of(19, 30), CourseType.SOFT);
    final Course c6 = mock(103L, date.plusDays(1), LocalTime.of(20, 30), CourseType.NORMAL);
    final Course c7 = mock(103L, date.plusDays(3), LocalTime.of(19, 30), CourseType.SOFT);
    final Course c8 = mock(103L, date.plusDays(3), LocalTime.of(20, 30), CourseType.NORMAL);
    return Arrays.asList(c1, c2, c3, c4, c5, c6, c7, c8);
  }

  private Course mock(Long id, LocalDate date, LocalTime start, CourseType type) {
    final Course course = new Course();
    course.setId(id);
    course.setInstructor("Freya");
    course.setStart(LocalDateTime.of(date, start));
    course.setMinutes(60L);
    course.setType(type);
    return course;
  }
}
