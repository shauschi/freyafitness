package freya.fitness.controller;

import freya.fitness.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.security.Principal;

@RestController
@RequestMapping("/profile")
public class ProfileController {

  @Autowired
  private UserService userService;

  @RequestMapping("/own")
  @ResponseBody
  public ProfileDto getOwnProfil(Principal principal) throws IOException {
    return new ProfileDto(userService.getCurrentUser());
  }
}
