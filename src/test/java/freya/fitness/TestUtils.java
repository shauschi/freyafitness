package freya.fitness;

import com.mongodb.client.gridfs.model.GridFSFile;
import freya.fitness.domain.jpa.Course;
import freya.fitness.domain.jpa.User;
import org.bson.BsonObjectId;
import org.springframework.data.mongodb.gridfs.GridFsResource;

import java.io.ByteArrayInputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.Optional;

public class TestUtils {

  public static final byte[] TEST_FILE_BYTES = new byte[]{0, 1, 1, 0};

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