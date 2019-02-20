package freya.fitness.service;

import freya.fitness.api.dto.CourseDto;
import freya.fitness.api.mapping.CourseMapper;
import freya.fitness.domain.jpa.Course;
import freya.fitness.domain.jpa.User;
import freya.fitness.repository.jpa.CourseRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Month;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.test.util.ReflectionTestUtils;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.isNull;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class CourseServiceTest {

  @InjectMocks
  private CourseService testee;

  @Mock
  private CourseRepository courseRepository;

  @Mock
  private CourseMapper courseDtoToCourseMapper;

  @Rule
  public ExpectedException expectedException = ExpectedException.none();

  @Before
  public void setUp() {
    ReflectionTestUtils.setField(testee, "minutes", 72);
    ReflectionTestUtils.setField(testee, "maxParticipants", 7);
  }

  @Test
  public void test_getCourses() {
    // given
    Course course = new Course();
    UUID uuid = UUID.randomUUID();
    course.setId(uuid);
    List<Course> courses = Collections.singletonList(course);
    when(courseRepository.findByStartBetween(any(), any())).thenReturn(courses);

    LocalDate start = LocalDate.of(2017, Month.DECEMBER, 7);
    LocalDate end = LocalDate.of(2017, Month.DECEMBER, 8);

    // when
    List<Course> result = testee.getCourses(start, end);

    // then
    verify(courseRepository).findByStartBetween(
        LocalDateTime.of(start, LocalTime.of(0, 0,0)),
        LocalDateTime.of(end, LocalTime.of(23, 59, 59)));
    assertThat(result, notNullValue());
    assertThat(result.size(), equalTo(1));
    assertThat(result.get(0).getId(), equalTo(uuid));
  }

  @Test
  public void test_getCoursesFrom() {
    // given
    LocalDate start = LocalDate.of(2017, Month.DECEMBER, 7);

    // when
    testee.getCoursesFrom(start);

    // then
    verify(courseRepository).findByStartGreaterThanEqual(
        LocalDateTime.of(start, LocalTime.of(0, 0, 0)));
  }

  @Test
  public void test_update_withNullValue() {
    // when
    Course result = testee.update(null, null);

    // then
    assertThat(result, nullValue());
    verify(courseRepository, never()).findById(any());
    verify(courseRepository, never()).save(any());
  }

  @Test
  public void test_update_noCourseId() {
    // given
    UUID uuid = UUID.randomUUID();
    CourseDto courseDto = new CourseDto();
    Course course = new Course();
    course.setId(uuid);
    when(courseRepository.save(any())).thenReturn(course);
    when(courseDtoToCourseMapper.map(any(CourseDto.class), isNull())).thenReturn(course);

    // when
    Course result = testee.update(null, courseDto);

    // then
    assertThat(result, notNullValue());
    assertThat(result.getId(), equalTo(uuid));
    verify(courseRepository, never()).findById(any());
    verify(courseDtoToCourseMapper).map(courseDto, null);
    verify(courseRepository).save(any());
  }

  @Test
  public void test_create_null() {
    // given
    when(courseDtoToCourseMapper.map((CourseDto) null, null)).thenReturn(null);

    // when
    Course result = testee.create(null);

    // then
    assertThat(result, nullValue());
  }

  @Test
  public void test_create() {
    // given
    CourseDto dto = new CourseDto();
    Course expectedResult = new Course();
    when(courseDtoToCourseMapper.map(eq(dto), isNull())).thenReturn(expectedResult);
    when(courseRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

    // when
    Course result = testee.create(dto);

    // then
    assertThat(result, notNullValue());
    assertThat(result, equalTo(expectedResult));
    verify(courseDtoToCourseMapper).map(eq(dto), isNull());
  }

  @Test
  public void test_createEmptyCourse() {
    // given
    final User instructor = new User();
    instructor.setFirstName("Testuser");

    // when
    Course result = testee.createEmptyCourse(instructor);

    // then
    assertThat(result, notNullValue());
    User resultInstructor = result.getInstructor();
    assertThat(resultInstructor, notNullValue());
    assertThat(resultInstructor.getFirstName(), equalTo("Testuser"));
    assertThat(result.getMinutes(), equalTo(72));
    assertThat(result.getMaxParticipants(), equalTo(7));
    LocalDateTime start = result.getStart();
    assertThat(start, notNullValue());
    assertThat(start.getMinute(), equalTo(0));
    assertThat(result.isCanceled(), equalTo(false));
  }

  @Test
  public void shouldCallRepositoryDeleteOnDelete() {
    // given
    UUID courseId = UUID.randomUUID();

    // when
    testee.delete(courseId);

    // then
    verify(courseRepository).deleteById(courseId);
  }

  @Test
  public void shouldThrowIllegalArgumentExceptionWhenDeletingInvalidCourseId() {
    // expected excpetion
    expectedException.expect(IllegalArgumentException.class);

    // given
    doThrow(new IllegalArgumentException()).when(courseRepository).deleteById(any());

    // when
    testee.delete(UUID.randomUUID());

    // then see expected excpetion
  }

}