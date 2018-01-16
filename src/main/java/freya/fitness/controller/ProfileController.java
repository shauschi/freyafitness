package freya.fitness.controller;

import freya.fitness.service.CurrentUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.websocket.server.PathParam;
import java.io.IOException;

@RestController
@RequestMapping("/profile")
public class ProfileController {

  @Autowired
  private CurrentUserService currentUserService;

  @RequestMapping("/own")
  @ResponseBody
  public ProfileDto getOwnProfil() throws IOException {
    return new ProfileDto(currentUserService.getCurrentUser());
  }
}
