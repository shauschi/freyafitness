package freya.fitness.utils.exception;

public abstract class EntityNotFoundException extends RuntimeException {

  protected EntityNotFoundException(final String message) {
    super(message);
  }

  protected EntityNotFoundException(final String messageTemplate, final String arg) {
    this(String.format(messageTemplate, arg));
  }

}
