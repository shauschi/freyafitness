package freya.fitness.utils.exception;

public class RoleNotFoundException extends EntityNotFoundException {

  public RoleNotFoundException(final String role) {
    super("Role " + role + " not found.");
  }

}
