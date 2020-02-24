package freya.fitness.api.user;

import freya.fitness.proxy.CreateEmail;
import freya.fitness.proxy.EmailProxy;
import freya.fitness.utils.exception.RoleNotFoundException;
import freya.fitness.utils.exception.UserAllreadyExistsException;
import freya.fitness.utils.exception.UserNotFoundException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service("userService")
public class UserService implements UserDetailsService {

  private static final Logger LOGGER = LogManager.getLogger(UserService.class);

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final RoleRepository roleRepository;
  private final EmailProxy emailProxy;

  @Value("${mail.account_created.receiver}")
  private String emailTo;

  @Autowired
  public UserService(
      final UserRepository userRepository,
      final PasswordEncoder passwordEncoder,
      final RoleRepository roleRepository,
      final EmailProxy emailProxy) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.roleRepository = roleRepository;
    this.emailProxy = emailProxy;
  }

  @Override
  public UserDetails loadUserByUsername(final String email) {
    final User user = userRepository.findByEmailIgnoreCase(email)
        .orElseThrow(() -> new UsernameNotFoundException(
            "Kein User zu E-Mail: '" + email + "' gefunden."));
    final Set<Role> userRoles = user.getRoles();
    if (userRoles.isEmpty()) {
      throw new UsernameNotFoundException(
          "Keine Rollen zu Benutzer: " + user + " gefunden.");
    }
    return new org.springframework.security.core.userdetails.User(
        user.getEmail(), user.getPassword(), userRoles);
  }

  public User getCurrentUser() {
    final Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth.getPrincipal().equals("anonymousUser")) {
      return null;
    }
    final org.springframework.security.core.userdetails.User user =
        (org.springframework.security.core.userdetails.User) auth.getPrincipal();
    final String email = user.getUsername();
    return userRepository.findByEmailIgnoreCase(email)
        .orElseThrow(RuntimeException::new);
  }

  public List<User> getAllUsers() {
    return userRepository.findAll();
  }

  public User getUser(final UUID userId) throws UserNotFoundException {
    return userRepository.findById(userId)
        .orElseThrow(() -> UserNotFoundException.withId(userId));
  }

  public void assertUserExists(final UUID userId) throws UserNotFoundException {
    if (!userRepository.existsById(userId)) {
      throw UserNotFoundException.withId(userId);
    }
  }

  public User getUserByEmail(final String email) throws UserNotFoundException {
    return userRepository.findByEmailIgnoreCase(email)
        .orElseThrow(() -> UserNotFoundException.withEmail(email));
  }

  public User saveUser(final User user) {
    return userRepository.save(user);
  }

  public User createAccount(final CreateAccountDto createAccountDto)
      throws UserAllreadyExistsException, RoleNotFoundException {
    final String email = createAccountDto.getEmail();
    final Optional<User> existingUser = userRepository.findByEmailIgnoreCase(email);
    if (existingUser.isPresent()) {
      throw new UserAllreadyExistsException(email);
    }

    final User newUser = new User();
    newUser.setEmail(email);
    newUser.setFirstName(createAccountDto.getFirstname());
    newUser.setFamilyName(createAccountDto.getLastname());
    final String password = createAccountDto.getPassword();
    final String encodedPassword = passwordEncoder.encode(password);
    newUser.setPassword(encodedPassword);
    newUser.setAccountCreationTime(LocalDateTime.now());

    final Role role = roleRepository.findByAuthority("USER")
        .orElseThrow(() -> new RoleNotFoundException("USER"));
    newUser.setRoles(Collections.singleton(role));

    final User savedUser = userRepository.save(newUser);
    LOGGER.info("New account created {}", savedUser);
    sendAccountCreatedMail(savedUser);
    return savedUser;
  }

  private void sendAccountCreatedMail(final User user) {
    final Map<String, String> parameters = new HashMap<>();
    parameters.put("firstname", user.getFirstName());
    parameters.put("lastname", user.getFamilyName());
    parameters.put("email", user.getEmail());

    emailProxy.createEmail(new CreateEmail(
        "ACCOUNT_CREATED",
        parameters,
        Collections.singletonList(emailTo),
        null,
        null));
  }

}
