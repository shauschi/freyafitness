package freya.fitness.service;

import freya.fitness.domain.jpa.Course;
import freya.fitness.domain.jpa.User;
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
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static freya.fitness.TestUtils.emptyCourse;
import static freya.fitness.TestUtils.testUser;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

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
    List<Course> courses = Collections.singletonList(course);
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

  @Test
  public void test_getCoursesFrom() {
    LocalDate start = LocalDate.of(2017, Month.DECEMBER, 7);

    testee.getCoursesFrom(start);

    verify(courseRepository).findByStartGreaterThanEqual(
        LocalDateTime.of(start, LocalTime.of(0, 0, 0)));
  }

  @Test
  public void test_addUserToCourse_returnNullIfCourseNotPresent() {
    when(courseRepository.findById(any())).thenReturn(Optional.empty());

    Course result = testee.addUserToCourse(testUser(), 123_456L);

    assertThat(result, nullValue());
    verify(courseRepository).findById(123_456L);
    verify(courseRepository, never()).save(any());
  }

  @Test
  public void test_addUserToCourse_returnCourseAfterUserWasAdded() {
    when(courseRepository.findById(123_456L)).thenReturn(emptyCourse());
    when(courseRepository.save(any()))
        .thenAnswer(invocation -> invocation.getArguments()[0]);

    Course result = testee.addUserToCourse(testUser(), 123_456L);

    assertThat(result, notNullValue());
    assertThat(result.getAttendees().size(), equalTo(1));
    verify(courseRepository).findById(123_456L);
    verify(courseRepository).save(any());
  }

  @Test
  public void test_removeUserToCourse_returnNullIfCourseNotPresent() {
    when(courseRepository.findById(any())).thenReturn(Optional.empty());

    Course result = testee.removeUserFromCourse(testUser(), 123_456L);

    assertThat(result, nullValue());
    verify(courseRepository).findById(123_456L);
    verify(courseRepository, never()).save(any());
  }

  @Test
  public void test_removeUserToCourse_returnCourseAfterUserWasRemoved() {
    User testUser = testUser();
    Optional<Course> course = emptyCourse();
    course.ifPresent(c -> c.getAttendees().add(testUser));
    when(courseRepository.findById(123_456L)).thenReturn(course);
    when(courseRepository.save(any()))
        .thenAnswer(invocation -> invocation.getArguments()[0]);

    Course result = testee.removeUserFromCourse(testUser, 123_456L);

    assertThat(result, notNullValue());
    assertThat(result.getAttendees().size(), equalTo(0));
    verify(courseRepository).findById(123_456L);
    verify(courseRepository).save(any());
  }
}