package freya.fitness.controller;

import freya.fitness.dto.CourseDto;
import freya.fitness.domain.Course;
import freya.fitness.domain.User;
import freya.fitness.service.CourseService;
import freya.fitness.service.CurrentUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/courses")
public class CourseController {

  @Autowired
  private CourseService courseService;

  @Autowired
  private CurrentUserService currentUserService;

  @RequestMapping("/{id}")
  @ResponseBody
  public CourseDto getCourseDetails(@PathVariable("id") final Long id) {
    User user = currentUserService.getCurrentUser();
    return courseService.getCourse(id)
        .map(course -> new CourseDto(user, course))
        .orElse(null);
  }

  @RequestMapping(value = "/{id}", method = RequestMethod.POST)
  @ResponseBody
  public CourseDto saveCourse(@RequestBody final CourseDto courseDto) {
    // TODO user rights?
    User user = currentUserService.getCurrentUser();
    Course updatedCourse = courseService.update(courseDto);
    return new CourseDto(user, updatedCourse);
  }

  @RequestMapping("/from/{from}")
  @ResponseBody
  public List<CourseDto> getCourses(@PathVariable("from") final String from) {
    User user = currentUserService.getCurrentUser();
    return toDtos(user, courseService.getCoursesFrom(LocalDate.parse(from)));
  }

  @RequestMapping("from/{from}/to/{to}")
  @ResponseBody
  public List<CourseDto> getCourses(
      @PathVariable("from") final String from,
      @PathVariable("to") final String to) {
    User user = currentUserService.getCurrentUser();
    return toDtos(user, courseService.getCourses(LocalDate.parse(from), LocalDate.parse(to)));
  }

  //@PutMapping
  @RequestMapping("{courseId}/signin")
  public ResponseEntity<CourseDto> signIn(@PathVariable("courseId") final Long courseId) {
    User user = currentUserService.getCurrentUser();
    Course changedCourse = courseService.addUserToCourse(user, courseId);
    if (changedCourse != null) {
      return ResponseEntity.accepted().body(new CourseDto(user, changedCourse));
    }
    return ResponseEntity.badRequest().build();
  }

  //@PutMapping
  @RequestMapping("{courseId}/signout")
  public ResponseEntity<CourseDto> signOut(@PathVariable("courseId") final Long courseId) {
    User user = currentUserService.getCurrentUser();
    Course changedCourse = courseService.removeUserFromCourse(user, courseId);
    if (changedCourse != null) {
      return ResponseEntity.accepted().body(new CourseDto(user, changedCourse));
    }
    return ResponseEntity.badRequest().build();
  }

  private List<CourseDto> toDtos(User user, List<Course> courses) {
    return courses.stream()
        .map(course -> new CourseDto(user, course))
        .collect(Collectors.toList());
  }
}
