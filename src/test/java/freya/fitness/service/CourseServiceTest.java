package freya.fitness.service;

import freya.fitness.domain.jpa.Course;
import freya.fitness.repository.jpa.CourseRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Month;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.notNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class CourseServiceTest {

  @InjectMocks
  private CourseService testee;

  @Mock
  private CourseRepository courseRepository;

  @Test
  public void test_getCourses() {
    Course course = new Course();
    course.setId(42L);
    List<Course> courses = Arrays.asList(course);
    when(courseRepository.findByStartBetween(any(), any())).thenReturn(courses);

    LocalDate start = LocalDate.of(2017, Month.DECEMBER, 7);
    LocalDate end = LocalDate.of(2017, Month.DECEMBER, 8);

    List<Course> result = testee.getCourses(start, end);

    verify(courseRepository).findByStartBetween(
        LocalDateTime.of(start, LocalTime.of(0, 0,0)),
        LocalDateTime.of(end, LocalTime.of(23, 59, 59)));
    assertThat(result, notNullValue());
    assertThat(result.size(), equalTo(1));
    assertThat(result.get(0).getId(), equalTo(42L));
  }
}