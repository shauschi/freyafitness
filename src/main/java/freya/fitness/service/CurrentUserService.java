package freya.fitness.service;

import freya.fitness.domain.User;
import freya.fitness.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

  @Autowired
  private UserRepository userRepository;

  public User getCurrentUser() {
    return userRepository.findById(1L).orElseThrow(RuntimeException::new);
  }
}
