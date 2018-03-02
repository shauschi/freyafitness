package freya.fitness.service;

import freya.fitness.domain.jpa.CourseType;
import freya.fitness.domain.jpa.News;
import freya.fitness.repository.jpa.CourseTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CourseTypeService {

  private final CourseTypeRepository courseTypeRepository;

  @Autowired
  public CourseTypeService(final CourseTypeRepository courseTypeRepository) {
    this.courseTypeRepository = courseTypeRepository;
  }

  public List<CourseType> getCurrentCourseTypes() {
    final LocalDateTime now = LocalDateTime.now();
    return courseTypeRepository
        .findByValidityFromLessThanEqualAndValidityToGreaterThanEqual(
            now, now);
  }

}
