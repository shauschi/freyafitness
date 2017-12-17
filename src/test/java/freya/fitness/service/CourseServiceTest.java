package freya.fitness.service;

import freya.fitness.domain.Course;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.junit.MockitoJUnitRunner;

import java.time.LocalDate;
import java.time.Month;
import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;

@RunWith(MockitoJUnitRunner.class)
public class CourseServiceTest {

  @InjectMocks
  private CourseService testee;

  @Test
  public void test_getCourses() {
    LocalDate start = LocalDate.of(2017, Month.DECEMBER, 7);
    LocalDate end = LocalDate.of(2017, Month.DECEMBER, 8);

    List<Course> result = testee.getCourses(start, end);

    // TODO Tests anpassen, sobald die Repository-Schicht angebunden ist
    assertThat(result.size(), equalTo(12));
  }
}