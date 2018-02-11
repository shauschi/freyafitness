package freya.fitness;

import freya.fitness.domain.jpa.Course;
import freya.fitness.domain.jpa.User;

import java.util.ArrayList;
import java.util.Optional;

public class TestUtils {

  public static Optional<Course> emptyCourse() {
    final Course course = new Course();
    course.setAttendees(new ArrayList<>());
    course.setMaxParticipants(10);
    return Optional.of(course);
  }

  public static User testUser() {
    final User user = new User();
    user.setFirstName("Testee");
    return user;
  }
}
