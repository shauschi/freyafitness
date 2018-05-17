package freya.fitness.utils;

public class InvalidPasswordException extends Exception {

  public InvalidPasswordException() {
    super("Das übermittelte Password ist nicht richtig");
  }

}
