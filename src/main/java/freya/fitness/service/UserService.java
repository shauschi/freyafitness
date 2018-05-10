package freya.fitness.service;

import freya.fitness.domain.jpa.Role;
import freya.fitness.domain.jpa.User;
import freya.fitness.dto.CreateAccountDto;
import freya.fitness.repository.jpa.UserRepository;
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
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service("userService")
public class UserService implements UserDetailsService {

  private UserRepository userRepository;
  private PasswordEncoder passwordEncoder;

  @Autowired
  public UserService(
      final UserRepository userRepository,
      final PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  public UserDetails loadUserByUsername(final String username)
      throws UsernameNotFoundException {
    final User user = userRepository.findByEmail(username)
        .orElseThrow(() -> new UsernameNotFoundException(
            "Kein User zu E-Mail: '" + username + "' gefunden."));
    final List<Role> userRoles = user.getRoles();
    if (userRoles.isEmpty()) {
      throw new UsernameNotFoundException(
          "Keine Rollen zu Benutzer: " + user + " gefunden.");
    }
    return new org.springframework.security.core.userdetails.User(
        username, user.getPassword(), userRoles);
  }

  public User getCurrentUser() {
    final Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth.getPrincipal().equals("anonymousUser")) {
      return null;
    }
    final org.springframework.security.core.userdetails.User user =
        (org.springframework.security.core.userdetails.User) auth.getPrincipal();
    final String userId = user.getUsername();
    return userRepository.findByEmail(userId)
        .orElseThrow(RuntimeException::new);
  }

  public User getUser(final UUID userId) throws UserNotFoundException {
    return userRepository.findById(userId)
        .orElseThrow(() -> UserNotFoundException.withId(userId));
  }

  public User getUserByEmail(final String userEmail) throws UserNotFoundException {
    return userRepository.findByEmail(userEmail)
        .orElseThrow(() -> UserNotFoundException.withEmail(userEmail));
  }

  public User saveUser(final User user) {
    return userRepository.save(user);
  }

  public User createAccount(
      final CreateAccountDto createAccountDto) throws UserAllreadyExistsException {
    final User newUser = new User();
    newUser.setFirstName(createAccountDto.getFirstname());
    newUser.setFamilyName(createAccountDto.getLastname());
    final String email = createAccountDto.getEmail();
    newUser.setEmail(email);
    final String encodedPassword =
        passwordEncoder.encode(createAccountDto.getPassword());
    newUser.setPassword(encodedPassword);

    final Optional<User> existingUser = userRepository.findByEmail(email);
    if (existingUser.isPresent()) {
      throw new UserAllreadyExistsException(email);
    }

    return userRepository.save(newUser);
  }
}
