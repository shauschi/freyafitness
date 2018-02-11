package freya.fitness.controller;

import freya.fitness.domain.jpa.User;
import freya.fitness.dto.ProfileDto;
import freya.fitness.service.CurrentUserService;
import freya.fitness.service.ProfilePictureService;
import freya.fitness.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.RedirectView;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

@RestController
@RequestMapping("/profile")
public class ProfileController {

  @Autowired
  private UserService userService;

  @Autowired
  private CurrentUserService currentUserService;

  @Autowired
  private ProfilePictureService profilePictureService;

  @GetMapping("/own")
  @ResponseBody
  public ProfileDto getOwnProfil() {
    return new ProfileDto(currentUserService.getCurrentUser());
  }

  @GetMapping("/{userId}/picture")
  @ResponseBody
  public ResponseEntity<Resource> getProfilePicture(@PathVariable final Long userId)
      throws IOException {
    final User user = userService.getUser(userId);
    final byte[] bytes =
        profilePictureService.getProfilePictureData(user.getProfilePictureId());
    return ResponseEntity.ok().body(new ByteArrayResource(bytes));
  }

  @PostMapping(
      value = "/picture/change",
      headers = "Content-Type=multipart/form-data")
  @ResponseBody
  public void changeProfilePicture(
      @RequestParam("image") final MultipartFile image)
      throws IOException, IllegalAccessException {
    final User user = currentUserService.getCurrentUser();
    profilePictureService.changeProfilePicture(user.getId(), image);
  }

}
