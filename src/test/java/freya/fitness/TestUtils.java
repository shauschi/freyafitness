package freya.fitness;

import freya.fitness.domain.jpa.Course;
import freya.fitness.domain.jpa.Membership;
import freya.fitness.domain.jpa.MembershipType;
import freya.fitness.domain.jpa.User;
import java.util.Optional;
import org.mockito.stubbing.Answer;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class TestUtils {

  public static final byte[] TEST_FILE_BYTES = new byte[]{0, 1, 1, 0};

  public static Answer<?> returnFirstArgument = answer -> answer.getArguments()[0];

  public static Optional<Course> emptyCourse() {
    final Course course = new Course();
    //course.setAttendees(new ArrayList<>());
    course.setMaxParticipants(10);
    return Optional.of(course);
  }

  public static Membership givenMembership(boolean isValid, int maxParticipations) {
    final Membership membership = mock(Membership.class);
    when(membership.isValid(any())).thenReturn(isValid);
    final MembershipType type = mock(MembershipType.class);
    when(membership.getType()).thenReturn(type);
    when(type.getMaxParticipations()).thenReturn(maxParticipations);
    return membership;
  }

  public static User testUser() {
    final User user = new User();
    user.setFirstName("Testee");
    return user;
  }

}
