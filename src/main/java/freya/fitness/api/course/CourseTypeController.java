package freya.fitness.api.course;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/coursetypes")
public class CourseTypeController {

  private final CourseTypeService courseTypeService;

  @Autowired
  public CourseTypeController(final CourseTypeService courseTypeService) {
    this.courseTypeService = courseTypeService;
  }

  @GetMapping("/")
  public List<CourseTypeDto> getAllValidCourseTypes() {
    return courseTypeService.getValidCourseTypes().stream()
        .map(CourseTypeDto::new)
        .collect(Collectors.toList());
  }
}
