package freya.fitness.utils.exception;

public class ResourceLoadingException extends Exception {

  public ResourceLoadingException(final String filename) {
    super(String.format("Could not load resource: %s", filename));
  }

  public ResourceLoadingException(final String filename, final Throwable cause) {
    super(String.format("Could not load resource: %s", filename), cause);
  }

}
