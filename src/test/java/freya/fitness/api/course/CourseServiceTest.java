package freya.fitness.api.course;

import freya.fitness.api.membership.ParticipationRepository;
import freya.fitness.api.user.User;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Month;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatExceptionOfType;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.isNull;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class})
@MockitoSettings(strictness = Strictness.LENIENT)
class CourseServiceTest {

  @InjectMocks
  private CourseService testee;

  @Mock
  private CourseRepository courseRepository;

  @Mock
  private ParticipationRepository participationRepository;

  @Mock
  private CourseMapper courseDtoToCourseMapper;

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(testee, "minutes", 72);
    ReflectionTestUtils.setField(testee, "maxParticipants", 7);
  }

  @Test
  void test_getCourses() {
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
        LocalDateTime.of(start, LocalTime.of(0, 0, 0)),
        LocalDateTime.of(end, LocalTime.of(23, 59, 59)));
    assertThat(result)
        .isNotNull()
        .hasSize(1);
    assertThat(result.get(0).getId()).isEqualTo(uuid);
  }

  @Test
  void test_getCoursesFrom() {
    // given
    LocalDate start = LocalDate.of(2017, Month.DECEMBER, 7);

    // when
    testee.getCoursesFrom(start);

    // then
    verify(courseRepository).findByStartGreaterThanEqual(
        LocalDateTime.of(start, LocalTime.of(0, 0, 0)));
  }

  @Test
  void test_update_withNullValue() {
    // when
    Course result = testee.update(null, null);

    // then
    assertThat(result).isNull();
    verify(courseRepository, never()).findById(any());
    verify(courseRepository, never()).save(any());
  }

  @Test
  void test_update_noCourseId() {
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
    assertThat(result).isNotNull();
    assertThat(result.getId()).isEqualTo(uuid);
    verify(courseRepository, never()).findById(any());
    verify(courseDtoToCourseMapper).map(courseDto, null);
    verify(courseRepository).save(any());
  }

  @Test
  void test_create_null() {
    // given
    when(courseDtoToCourseMapper.map((CourseDto) null, null)).thenReturn(null);

    // when
    Course result = testee.create(null);

    // then
    assertThat(result).isNull();
  }

  @Test
  void test_create() {
    // given
    CourseDto dto = new CourseDto();
    Course expectedResult = new Course();
    when(courseDtoToCourseMapper.map(eq(dto), isNull())).thenReturn(expectedResult);
    when(courseRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

    // when
    Course result = testee.create(dto);

    // then
    assertThat(result).isNotNull().isEqualTo(expectedResult);
    verify(courseDtoToCourseMapper).map(eq(dto), isNull());
  }

  @Test
  void test_createEmptyCourse() {
    // given
    final User instructor = new User();
    instructor.setFirstName("Testuser");

    // when
    Course result = testee.createEmptyCourse(instructor);

    // then
    assertThat(result).isNotNull();
    User resultInstructor = result.getInstructor();
    assertThat(resultInstructor).isNotNull();
    assertThat(resultInstructor.getFirstName()).isEqualTo("Testuser");
    assertThat(result.getMinutes()).isEqualTo(72);
    assertThat(result.getMaxParticipants()).isEqualTo(7);
    LocalDateTime start = result.getStart();
    assertThat(start).isNotNull();
    assertThat(start.getMinute()).isEqualTo(0);
    assertThat(result.isCanceled()).isFalse();
  }

  @Test
  void shouldCallRepositoryDeleteOnDelete() {
    // given
    UUID courseId = UUID.randomUUID();

    // when
    testee.delete(courseId);

    // then
    verify(courseRepository).deleteById(courseId);
  }

  @Test
  void shouldThrowIllegalArgumentExceptionWhenDeletingInvalidCourseId() {
    assertThatExceptionOfType(IllegalArgumentException.class).isThrownBy(() -> {
      // given
      doThrow(new IllegalArgumentException()).when(courseRepository).deleteById(any());

      // when
      testee.delete(UUID.randomUUID());
    });
  }

}
