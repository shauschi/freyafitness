package freya.fitness.service;

import freya.fitness.domain.jpa.Role;
import freya.fitness.domain.jpa.User;
import freya.fitness.api.dto.CreateAccountDto;
import freya.fitness.repository.jpa.RoleRepository;
import freya.fitness.repository.jpa.UserRepository;
import freya.fitness.utils.RoleNotFoundException;
import freya.fitness.utils.UserAllreadyExistsException;
import freya.fitness.utils.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service("userService")
public class UserService implements UserDetailsService {

  private UserRepository userRepository;
  private PasswordEncoder passwordEncoder;
  private RoleRepository roleRepository;

  @Autowired
  public UserService(
      final UserRepository userRepository,
      final PasswordEncoder passwordEncoder,
      final RoleRepository roleRepository) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.roleRepository = roleRepository;
  }

  @Override
  public UserDetails loadUserByUsername(final String email) {
    final User user = userRepository.findByEmailIgnoreCase(email)
        .orElseThrow(() -> new UsernameNotFoundException(
            "Kein User zu E-Mail: '" + email + "' gefunden."));
    final List<Role> userRoles = user.getRoles();
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
    newUser.setRoles(Collections.singletonList(role));

    return userRepository.save(newUser);
  }

}
