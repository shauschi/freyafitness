package freya.fitness.utils.exception;

public class InvalidResetTokenException extends Exception {

  public InvalidResetTokenException(final String token) {
    super("Ungültiger Reset-Token: " + token);
  }

}
