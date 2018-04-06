package freya.fitness.service;

import freya.fitness.domain.jpa.User;
import freya.fitness.dto.CreateAccountDto;
import freya.fitness.repository.jpa.UserRepository;
import freya.fitness.utils.UserAllreadyExistsException;
import freya.fitness.utils.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.validation.Valid;
import java.util.Collections;
import java.util.Optional;

@Service("userService")
public class UserService implements UserDetailsService {

  private UserRepository userRepository;

  @Autowired
  public UserService(final UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    final User user = userRepository.findByEmail(username)
        .orElseThrow(() -> new UsernameNotFoundException(
            "Kein User zu E-Mail: '" + username + "' gefunden."));
    return new org.springframework.security.core.userdetails.User(
        username, user.getPassword(),
        Collections.singletonList(new SimpleGrantedAuthority("USER")));
  }

  public User getCurrentUser() {
    final Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth.getPrincipal().equals("anonymousUser")) {
      return null;
    }
    final org.springframework.security.core.userdetails.User user =
        (org.springframework.security.core.userdetails.User) auth.getPrincipal();
    final String userId = user.getUsername();
    return userRepository.findByEmail(userId).orElseThrow(RuntimeException::new);
  }

  public User getUser(final Long userId) throws UserNotFoundException {
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
    newUser.setPassword(createAccountDto.getPassword());

    final Optional<User> existingUser = userRepository.findByEmail(email);
    if (existingUser.isPresent()) {
      throw new UserAllreadyExistsException(email);
    }

    return userRepository.save(newUser);
  }
}
