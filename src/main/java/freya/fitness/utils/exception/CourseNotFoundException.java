package freya.fitness.utils.exception;

import java.util.UUID;

public class CourseNotFoundException extends EntityNotFoundException {

  private CourseNotFoundException(final String message) {
    super(message);
  }

  public static CourseNotFoundException withId(final UUID id) {
    return new CourseNotFoundException(
        String.format("Kein Kurs gefunden mit der ID: %s", String.valueOf(id)));
  }

}
