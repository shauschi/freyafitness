package freya.fitness.utils.exception;

public class UserAllreadyExistsException extends Exception {

  public UserAllreadyExistsException(final String email) {
    super("A user with username " + email + " allready exists.");
  }

}
