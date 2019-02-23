package freya.fitness.service;

import freya.fitness.domain.jpa.CourseType;
import freya.fitness.repository.jpa.CourseTypeRepository;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class})
class CourseTypeServiceTest {

  @InjectMocks
  private CourseTypeService testee;

  @Mock
  private CourseTypeRepository courseTypeRepository;

  @Test
  void test_getValidCourseTypes() {
    CourseType course1 = new CourseType();
    course1.setName("Test 1");
    CourseType course2 = new CourseType();
    course2.setName("Test 2");
    List<CourseType> list = Arrays.asList(course1, course2);
    when(courseTypeRepository.findByValidityFromLessThanEqualAndValidityToGreaterThanEqual(
        any(), any())).thenReturn(list);

    List<CourseType> result = testee.getValidCourseTypes();

    assertThat(result).hasSize(2)
        .extracting(CourseType::getName)
        .containsExactly("Test 1", "Test 2");
  }

}