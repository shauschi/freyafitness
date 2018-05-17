package freya.fitness.utils;

public class RoleNotFoundException extends Exception {

  public RoleNotFoundException(final String role) {
    super("Role " + role + " not found.");
  }

}
