package freya.fitness.service;

import freya.fitness.domain.jpa.User;
import freya.fitness.repository.jpa.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service("userService")
public class UserService implements UserDetailsService {

  private UserRepository userRepository;

  public UserService(final UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    return null;
  }

  public User getCurrentUser() {
    return userRepository.findById(1L).orElseThrow(RuntimeException::new);
  }

  public User getUser(final Long userId) {
    return userRepository.findById(userId).orElseThrow(RuntimeException::new);
  }

}
