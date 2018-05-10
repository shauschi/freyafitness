package freya.fitness.controller;

import freya.fitness.domain.jpa.Course;
import freya.fitness.domain.jpa.User;
import freya.fitness.dto.CourseDto;
import freya.fitness.service.CourseService;
import freya.fitness.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/courses")
public class CourseController {

  private final CourseService courseService;

  private final UserService userService;

  @Autowired
  public CourseController(final CourseService courseService, final UserService userService) {
    this.courseService = courseService;
    this.userService = userService;
  }

  @PreAuthorize("hasAnyRole('USER', 'TRAINER', 'ADMIN')")
  @GetMapping("/{id}")
  public CourseDto getCourseDetails(@PathVariable("id") final UUID id) {
    final User user = userService.getCurrentUser();
    return courseService.getCourse(id)
        .map(course -> new CourseDto(user, course))
        .orElse(null);
  }

  @PreAuthorize("hasAnyRole('TRAINER', 'ADMIN')")
  @PostMapping("/{id}")
  public CourseDto saveCourse(@PathVariable("id") final UUID id,
                              @RequestBody final CourseDto courseDto) {
    // TODO user rights?
    final User user = userService.getCurrentUser();
    final Course updatedCourse = courseService.update(id, courseDto);
    return new CourseDto(user, updatedCourse);
  }

  @PreAuthorize("hasAnyRole('TRAINER', 'ADMIN')")
  @GetMapping("/create")
  public CourseDto createNewCourse() {
    final User user = userService.getCurrentUser();
    final Course course = courseService.createEmptyCourse(user);
    return new CourseDto(user, course);
  }

  @PreAuthorize("hasAnyRole('TRAINER', 'ADMIN')")
  @PostMapping("/create")
  public CourseDto saveNewCourse(@RequestBody final CourseDto courseDto) {
    // TODO user rights?
    final User user = userService.getCurrentUser();
    final Course updatedCourse = courseService.create(courseDto);
    return new CourseDto(user, updatedCourse);
  }

  @PreAuthorize("hasAnyRole('USER', 'TRAINER', 'ADMIN')")
  @GetMapping("/from/{from}")
  public List<CourseDto> getCourses(@PathVariable("from") final String from) {
    final User user = userService.getCurrentUser();
    return toDtos(user, courseService.getCoursesFrom(LocalDate.parse(from)));
  }

  @PreAuthorize("hasAnyRole('USER', 'TRAINER', 'ADMIN')")
  @GetMapping("from/{from}/to/{to}")
  public List<CourseDto> getCourses(
      @PathVariable("from") final String from,
      @PathVariable("to") final String to) {
    final User user = userService.getCurrentUser();
    return toDtos(user, courseService.getCourses(LocalDate.parse(from), LocalDate.parse(to)));
  }

  @PreAuthorize("hasRole('USER')")
  @PutMapping("{courseId}/signin")
  public ResponseEntity<CourseDto> signIn(@PathVariable("courseId") final UUID courseId) {
    final User user = userService.getCurrentUser();
    final Course changedCourse = courseService.addUserToCourse(user, courseId);
    if (changedCourse != null) {
      return ResponseEntity.accepted().body(new CourseDto(user, changedCourse));
    }
    return ResponseEntity.badRequest().build();
  }

  @PreAuthorize("hasRole('USER')")
  @PutMapping("{courseId}/signout")
  public ResponseEntity<CourseDto> signOut(@PathVariable("courseId") final UUID courseId) {
    final User user = userService.getCurrentUser();
    final Course changedCourse = courseService.removeUserFromCourse(user, courseId);
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
