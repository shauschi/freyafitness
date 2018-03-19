package freya.fitness.controller;

import freya.fitness.domain.jpa.User;
import freya.fitness.dto.ProfileDto;
import freya.fitness.service.ProfilePictureService;
import freya.fitness.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/profile")
public class ProfileController {

  private final UserService userService;

  private final ProfilePictureService profilePictureService;

  @Autowired
  public ProfileController(final UserService userService, final ProfilePictureService profilePictureService) {
    this.userService = userService;
    this.profilePictureService = profilePictureService;
  }

  @GetMapping("/own")
  public ProfileDto getOwnProfil() {
    return new ProfileDto(userService.getCurrentUser());
  }

  @GetMapping("/{userId}/picture")
  public ResponseEntity<Resource> getProfilePicture(@PathVariable final Long userId)
      throws IOException {
    final User user = userService.getUser(userId);
    final String profilePictureId = user.getProfilePictureId();
    if (profilePictureId == null) {
      return ResponseEntity.notFound().build();
    } else {
      final byte[] bytes =
          profilePictureService.getProfilePictureData(profilePictureId);
      return ResponseEntity.ok().body(new ByteArrayResource(bytes));
    }
  }

  @PostMapping("/picture/change")
  public ProfileDto changeProfilePicture(
      @RequestParam("image") final MultipartFile image) throws IOException {
    final User user = userService.getCurrentUser();
    final User updatedUser = profilePictureService.changeProfilePicture(user.getId(), image);
    return new ProfileDto(updatedUser);
  }

}
