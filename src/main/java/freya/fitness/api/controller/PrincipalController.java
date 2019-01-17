package freya.fitness.api.controller;

import freya.fitness.service.UserService;
import java.security.Principal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class PrincipalController {

  @Autowired
  private UserService userService;

  @GetMapping("/me")
  public UserDetails getCurrentUser(final Principal user) {
    return userService.loadUserByUsername(user.getName());
  }

}
