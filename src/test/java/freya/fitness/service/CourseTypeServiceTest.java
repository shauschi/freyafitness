package freya.fitness.service;

import freya.fitness.domain.jpa.CourseType;
import freya.fitness.repository.jpa.CourseTypeRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class CourseTypeServiceTest {

  @InjectMocks
  private CourseTypeService testee;

  @Mock
  private CourseTypeRepository courseTypeRepository;

  @Test
  public void test_getValidCourseTypes() {
    CourseType course1 = new CourseType();
    course1.setName("Test 1");
    CourseType course2 = new CourseType();
    course2.setName("Test 2");
    List<CourseType> list = Arrays.asList(course1, course2);
    when(courseTypeRepository.findByValidityFromLessThanEqualAndValidityToGreaterThanEqual(
        any(), any())).thenReturn(list);

    List<CourseType> result = testee.getValidCourseTypes();

    assertThat(result.size(), equalTo(2));
    assertThat(result.get(0).getName(), equalTo("Test 1"));
    assertThat(result.get(1).getName(), equalTo("Test 2"));
  }

}