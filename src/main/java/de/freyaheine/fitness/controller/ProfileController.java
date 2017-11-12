package de.freyaheine.fitness.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class ProfileController {

  @RequestMapping("/profile")
  @ResponseBody
  public ProfileDto getProfil() throws IOException {
    ProfileDto profile = new ProfileDto();
    profile.setFirstname("Max");
    profile.setLastname("Muster");
    return profile;
  }
}
