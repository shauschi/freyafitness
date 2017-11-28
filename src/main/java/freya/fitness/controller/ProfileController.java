package freya.fitness.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.websocket.server.PathParam;
import java.io.IOException;

@RestController
public class ProfileController {

  @RequestMapping("/profile/{id}")
  @ResponseBody
  public ProfileDto getProfil(@PathParam("id") Long id) throws IOException {
    ProfileDto profile = new ProfileDto();
    profile.setFirstname("Max");
    profile.setLastname("Muster");
    return profile;
  }
}
