package freya.fitness.api.course;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CourseTypeService {

  private final CourseTypeRepository courseTypeRepository;

  @Autowired
  public CourseTypeService(final CourseTypeRepository courseTypeRepository) {
    this.courseTypeRepository = courseTypeRepository;
  }

  public List<CourseType> getValidCourseTypes() {
    final LocalDateTime now = LocalDateTime.now();
    return courseTypeRepository
        .findByValidityFromLessThanEqualAndValidityToGreaterThanEqual(
            now, now);
  }

}
