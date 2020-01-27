package freya.fitness.api.controller;

import freya.fitness.api.dto.CourseDto;
import freya.fitness.api.dto.MessageDto;
import freya.fitness.api.dto.ReasonDto;
import freya.fitness.api.mapping.CourseMapper;
import freya.fitness.domain.jpa.Course;
import freya.fitness.domain.jpa.Membership;
import freya.fitness.domain.jpa.User;
import freya.fitness.proxy.CreateEmail;
import freya.fitness.proxy.EmailProxy;
import freya.fitness.service.CourseService;
import freya.fitness.service.MembershipService;
import freya.fitness.service.ParticipationService;
import freya.fitness.service.UserService;
import freya.fitness.utils.exception.ActionNotAllowedException;
import freya.fitness.utils.exception.CourseNotFoundException;
import freya.fitness.utils.exception.MembershipException;
import freya.fitness.utils.exception.UserNotFoundException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
  private final CourseMapper courseMapper;
  private final EmailProxy emailProxy;

  @Value("${mail.contact.receiver}")
  private String emailTo;

  @Autowired
  public CourseController(
      final CourseService courseService,
      final UserService userService,
      final ParticipationService participationService,
      final MembershipService membershipService,
      final CourseMapper courseMapper,
      final EmailProxy emailProxy) {
    this.courseService = courseService;
    this.userService = userService;
    this.participationService = participationService;
    this.membershipService = membershipService;
    this.courseMapper = courseMapper;
    this.emailProxy = emailProxy;
  }

  @PreAuthorize("hasAnyAuthority('USER', 'TRAINER', 'ADMIN')")
  @GetMapping("/{id}")
  public CourseDto getCourseDetails(@PathVariable("id") final UUID id) throws CourseNotFoundException {
    final Course course = courseService.getCourse(id);
    return courseMapper.map(course);
  }

  @PreAuthorize("hasAnyAuthority('TRAINER', 'ADMIN')")
  @PostMapping("/{id}")
  public CourseDto saveCourse(
      @PathVariable("id") final UUID id,
      @RequestBody final CourseDto courseDto) throws CourseNotFoundException {
    final Course updatedCourse = courseService.update(id, courseDto);
    return courseMapper.map(updatedCourse);
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
    return courseMapper.map(course);
  }

  @PreAuthorize("hasAnyAuthority('TRAINER', 'ADMIN')")
  @PostMapping("/create")
  public CourseDto saveNewCourse(@RequestBody final CourseDto courseDto) {
    final User user = userService.getCurrentUser();
    final Course updatedCourse = courseService.create(courseDto);
    return courseMapper.map(updatedCourse);
  }

  @PreAuthorize("hasAnyAuthority('USER', 'TRAINER', 'ADMIN')")
  @GetMapping("/from/{from}")
  public List<CourseDto> getCourses(@PathVariable("from") final String fromAsString) {
    final LocalDate from = LocalDate.parse(fromAsString);
    final List<Course> courses = courseService.getCoursesFrom(from);
    if (courses.isEmpty()) {
      return Collections.emptyList();
    }
    return toDtos(courses);
  }

  @PreAuthorize("hasAnyAuthority('USER', 'TRAINER', 'ADMIN')")
  @GetMapping("from/{from}/to/{to}")
  public List<CourseDto> getCourses(
      @PathVariable("from") final String from,
      @PathVariable("to") final String to) {
    final List<Course> courses = courseService.getCourses(LocalDate.parse(from), LocalDate.parse(to));
    return toDtos(courses);
  }

  @PreAuthorize("hasAuthority('USER')")
  @PutMapping("{courseId}/signin")
  public CourseDto signIn(@PathVariable("courseId") final UUID courseId)
      throws CourseNotFoundException, MembershipException, UserNotFoundException {
    final User user = userService.getCurrentUser();
    final Course course = courseService.getCourse(courseId);
    final Membership membership =
        membershipService.getCurrentMembershipForUser(user.getId(), course.getStart());
    final Course updatedCourse = participationService.addUserToCourse(membership, courseId);
    return courseMapper.map(updatedCourse);
  }

  @PreAuthorize("hasAuthority('USER')")
  @PutMapping("{courseId}/signout")
  public CourseDto signOut(
      @PathVariable("courseId") final UUID courseId,
      @RequestBody final ReasonDto reason) throws ActionNotAllowedException {
    final User user = userService.getCurrentUser();
    final Course course = courseService.getCourse(courseId);
    if (course.getStart().isBefore(LocalDateTime.now(ZoneId.of("Europe/Paris")).plusHours(3))) {
      throw new ActionNotAllowedException(
          "Abmeldungen sind nur bis 3 Stunden vor Kursstart erlaubt.");
    }
    final Course updatedCourse = participationService.removeUserFromCourse(user.getId(), courseId);
    informFreyaAboutSignOut(user, course, reason);
    return courseMapper.map(updatedCourse);
  }

  private void informFreyaAboutSignOut(final User user, final Course course, final ReasonDto reason) {
    HashMap<String, String> params = new HashMap<>();
    params.put("course_start_date", course.getStart().format(DateTimeFormatter.ofPattern("DD.MM.YYYY")));
    params.put("course_start_time", course.getStart().format(DateTimeFormatter.ofPattern("HH:mm")));
    params.put("course_type", course.getType().getName());
    params.put("user_firstname", user.getFirstName());
    params.put("user_lastname", user.getFamilyName());
    params.put("user_mail", user.getEmail());
    params.put("reason", reason.getReason());
    try {
      final CreateEmail mail = new CreateEmail(
          "CANCELLATION",
          params,
          Collections.singletonList(emailTo),
          Collections.emptyList(),
          Collections.emptyList());
      emailProxy.createEmail(mail);
    } catch (Exception e) {
      // not good, but not too bad also
    }
  }

  @PreAuthorize("hasAnyAuthority('TRAINER', 'ADMIN')")
  @PutMapping("{courseId}/adduser/{userId}")
  public CourseDto addUserToCourse(
      @PathVariable("courseId") final UUID courseId,
      @PathVariable("userId") final UUID userId)
      throws UserNotFoundException, CourseNotFoundException, MembershipException {
    final User user = userService.getUser(userId);
    final Course course = courseService.getCourse(courseId);
    final Membership membership =
        membershipService.getCurrentMembershipForUser(userId, course.getStart());
    final Course updatedCourse = participationService.addUserToCourse(membership, courseId);
    return courseMapper.map(updatedCourse);
  }

  @PreAuthorize("hasAnyAuthority('TRAINER', 'ADMIN')")
  @PutMapping("{courseId}/removeuser/{userId}")
  public CourseDto removeUserFromCourse(
      @PathVariable("courseId") final UUID courseId,
      @PathVariable("userId") final UUID userId) {
    final User user = userService.getUser(userId);
    final Course course = participationService.removeUserFromCourse(userId, courseId);
    return courseMapper.map(course);
  }

  private List<CourseDto> toDtos(final List<Course> courses) {
    return courses.stream()
        .map(courseMapper::map)
        .collect(Collectors.toList());
  }

}
