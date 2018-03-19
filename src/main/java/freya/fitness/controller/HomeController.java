package freya.fitness.controller;

import freya.fitness.dto.ProfileDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class HomeController {

  @Autowired
  private ProfileController profileController;

  @GetMapping("/")
  public ModelAndView index() {
    final ModelAndView modelAndView = new ModelAndView("index.html");
    final ProfileDto currentUser = profileController.getOwnProfil();
    modelAndView.addObject("currentUser", currentUser);
    return modelAndView;
  }
}
