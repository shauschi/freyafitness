package freya.fitness.utils;

public class UserNotFoundException extends Exception {

  private UserNotFoundException(final String message) {
    super(message);
  }

  public static UserNotFoundException withId(final Long id) {
    return new UserNotFoundException(
        String.format("Kein Benutzer gefunden mit der ID: %s", id));
  }

  public static UserNotFoundException withEmail(final String email) {
    return new UserNotFoundException(
        String.format("Kein Benutzer gefunden mit der E-Mail: %s", email));
  }
}
