package freya.fitness;

import com.mongodb.client.gridfs.model.GridFSFile;
import freya.fitness.domain.jpa.Course;
import freya.fitness.domain.jpa.Membership;
import freya.fitness.domain.jpa.MembershipType;
import freya.fitness.domain.jpa.User;
import java.io.ByteArrayInputStream;
import java.util.Date;
import java.util.Optional;
import org.bson.BsonObjectId;
import org.mockito.stubbing.Answer;
import org.springframework.data.mongodb.gridfs.GridFsResource;

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

  public static GridFSFile gridFSFile(final String filename) {
    return new GridFSFile(new BsonObjectId(), filename,
        1_000L, 10, new Date(),
        "md5String", null);
  }

  public static GridFsResource gridFsResource(final GridFSFile file) {
    final ByteArrayInputStream is = new ByteArrayInputStream(TEST_FILE_BYTES);
    return new GridFsResource(file, is);
  }
}
