package freya.fitness.service;

import freya.fitness.domain.jpa.User;
import freya.fitness.repository.jpa.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

  @Autowired
  private UserRepository userRepository;

  public User getUser(final Long userId) {
    return userRepository.findById(userId).orElseThrow(RuntimeException::new);
  }
}
