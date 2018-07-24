package freya.fitness.utils.exception;

import java.util.UUID;

public class UserNotFoundException extends EntityNotFoundException {

  private UserNotFoundException(final String message) {
    super(message);
  }

  public static UserNotFoundException withId(final UUID id) {
    return new UserNotFoundException(
        String.format("Kein Benutzer gefunden mit der ID: %s", String.valueOf(id)));
  }

  public static UserNotFoundException withEmail(final String email) {
    return new UserNotFoundException(
        String.format("Kein Benutzer gefunden mit der E-Mail: %s", email));
  }
}
