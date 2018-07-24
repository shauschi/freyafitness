package freya.fitness.utils.exception;

public class MailTemplateNotFoundException extends Exception {

  public MailTemplateNotFoundException(final String filename) {
    super(String.format("Folgende Datei wurde nicht gefunden: %s Bitte wende dich an einen Administrator,",
        String.valueOf(filename)));
  }

}
