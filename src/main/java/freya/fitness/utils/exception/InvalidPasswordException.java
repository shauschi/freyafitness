package freya.fitness.utils.exception;

public class InvalidPasswordException extends Exception {

  public InvalidPasswordException() {
    super("Das übermittelte Password ist nicht richtig");
  }

}
