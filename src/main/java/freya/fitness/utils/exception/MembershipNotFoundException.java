package freya.fitness.utils.exception;

import java.util.UUID;

public class MembershipNotFoundException extends EntityNotFoundException {

  private MembershipNotFoundException(final String message) {
    super(message);
  }

  public static MembershipNotFoundException withId(final UUID id) {
    return new MembershipNotFoundException(
        String.format("Keine Mitgliedschaft gefunden mit der ID: %s", String.valueOf(id)));
  }

}
