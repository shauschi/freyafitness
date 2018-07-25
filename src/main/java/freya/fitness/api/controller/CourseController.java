package freya.fitness.api.controller;

import freya.fitness.api.dto.CourseDto;
import freya.fitness.api.dto.MessageDto;
import freya.fitness.domain.jpa.Course;
import freya.fitness.domain.jpa.Membership;
import freya.fitness.domain.jpa.User;
import freya.fitness.service.CourseService;
import freya.fitness.service.MembershipService;
import freya.fitness.service.ParticipationService;
import freya.fitness.service.UserService;
import freya.fitness.utils.exception.CourseNotFoundException;
import freya.fitness.utils.exception.MembershipException;
import freya.fitness.utils.exception.UserNotFoundException;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/courses")
public class CourseController {

  private final CourseService courseService;
  private final UserService userService;
  private final ParticipationService participationService;
  private final MembershipService membershipService;

  @Autowired
  public CourseController(
      final CourseService courseService,
      final UserService userService,
      final ParticipationService participationService,
      final MembershipService membershipService) {
    this.courseService = courseService;
    this.userService = userService;
    this.participationService = participationService;
    this.membershipService = membershipService;
  }

  @PreAuthorize("hasAnyAuthority('USER', 'TRAINER', 'ADMIN')")
  @GetMapping("/{id}")
  public CourseDto getCourseDetails(@PathVariable("id") final UUID id) throws CourseNotFoundException {
    final User user = userService.getCurrentUser();
    final Course course = courseService.getCourse(id);
    return new CourseDto(user, course);
  }

  @PreAuthorize("hasAnyAuthority('TRAINER', 'ADMIN')")
  @PostMapping("/{id}")
  public CourseDto saveCourse(
      @PathVariable("id") final UUID id,
      @RequestBody final CourseDto courseDto) throws CourseNotFoundException {
    final User user = userService.getCurrentUser();
    final Course updatedCourse = courseService.update(id, courseDto);
    return new CourseDto(user, updatedCourse);
  }

  @PreAuthorize("hasAnyAuthority('TRAINER', 'ADMIN')")
  @DeleteMapping("/{id}")
  public MessageDto deleteCourse(@PathVariable("id") final UUID id) {
    courseService.delete(id);
    return new MessageDto("Kurs erfolgreich gelöscht");
  }

  @PreAuthorize("hasAnyAuthority('TRAINER', 'ADMIN')")
  @GetMapping("/create")
  public CourseDto createNewCourse() {
    final User user = userService.getCurrentUser();
    final Course course = courseService.createEmptyCourse(user);
    return new CourseDto(user, course);
  }

  @PreAuthorize("hasAnyAuthority('TRAINER', 'ADMIN')")
  @PostMapping("/create")
  public CourseDto saveNewCourse(@RequestBody final CourseDto courseDto) {
    final User user = userService.getCurrentUser();
    final Course updatedCourse = courseService.create(courseDto);
    return new CourseDto(user, updatedCourse);
  }

  @PreAuthorize("hasAnyAuthority('USER', 'TRAINER', 'ADMIN')")
  @GetMapping("/from/{from}")
  public List<CourseDto> getCourses(@PathVariable("from") final String fromAsString) {
    final User user = userService.getCurrentUser();
    final LocalDate from = LocalDate.parse(fromAsString);
    final List<Course> courses = courseService.getCoursesFrom(from);
    if (courses.isEmpty()) {
      return Collections.emptyList();
    }
    return toDtos(user, courses);
  }

  @PreAuthorize("hasAnyAuthority('USER', 'TRAINER', 'ADMIN')")
  @GetMapping("from/{from}/to/{to}")
  public List<CourseDto> getCourses(
      @PathVariable("from") final String from,
      @PathVariable("to") final String to) {
    final User user = userService.getCurrentUser();
    final List<Course> courses = courseService.getCourses(LocalDate.parse(from), LocalDate.parse(to));
    return toDtos(user, courses);
  }

  @PreAuthorize("hasAuthority('USER')")
  @PutMapping("{courseId}/signin")
  public CourseDto signIn(@PathVariable("courseId") final UUID courseId)
      throws CourseNotFoundException, MembershipException, UserNotFoundException {
    final User user = userService.getCurrentUser();
    final Membership membership = membershipService.getCurrentMembershipForUser(user.getId());
    final Course course = participationService.addUserToCourse(membership, courseId);
    return new CourseDto(user, course);
  }

  @PreAuthorize("hasAuthority('USER')")
  @PutMapping("{courseId}/signout")
  public CourseDto signOut(@PathVariable("courseId") final UUID courseId) {
    final User user = userService.getCurrentUser();
    final Course course = participationService.removeUserFromCourse(user.getId(), courseId);
    return new CourseDto(user, course);
  }

  @PreAuthorize("hasAnyAuthority('TRAINER', 'ADMIN')")
  @PutMapping("{courseId}/adduser/{userId}")
  public CourseDto addUserToCourse(
      @PathVariable("courseId") final UUID courseId,
      @PathVariable("userId") final UUID userId)
      throws UserNotFoundException, CourseNotFoundException, MembershipException {
    final User user = userService.getUser(userId);
    final Membership membership = membershipService.getCurrentMembershipForUser(userId);
    final Course course = participationService.addUserToCourse(membership, courseId);
    return new CourseDto(user, course);
  }

  @PreAuthorize("hasAnyAuthority('TRAINER', 'ADMIN')")
  @PutMapping("{courseId}/removeuser/{userId}")
  public CourseDto removeUserFromCourse(
      @PathVariable("courseId") final UUID courseId,
      @PathVariable("userId") final UUID userId) {
    final User user = userService.getUser(userId);
    final Course course = participationService.removeUserFromCourse(userId, courseId);
    return new CourseDto(user, course);
  }

  private List<CourseDto> toDtos(User user, List<Course> courses) {
    return courses.stream()
        .map(course -> new CourseDto(user, course))
        .collect(Collectors.toList());
  }

}
