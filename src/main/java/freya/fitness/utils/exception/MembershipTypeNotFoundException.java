package freya.fitness.utils.exception;

import java.util.UUID;

public class MembershipTypeNotFoundException extends EntityNotFoundException {

  private MembershipTypeNotFoundException(final String message) {
    super(message);
  }

  public static MembershipTypeNotFoundException withId(final UUID id) {
    return new MembershipTypeNotFoundException(
        String.format("Keine Art der Mitgliedschaft gefunden mit der ID: %s", String.valueOf(id)));
  }

}
