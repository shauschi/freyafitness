package freya.fitness.controller;

import freya.fitness.domain.jpa.User;
import freya.fitness.dto.CreateAccountDto;
import freya.fitness.dto.ProfileDto;
import freya.fitness.dto.UserDto;
import freya.fitness.service.ProfilePictureService;
import freya.fitness.utils.UserAllreadyExistsException;
import freya.fitness.utils.UserNotFoundException;
import freya.fitness.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
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

  @PostMapping("/create")
  public ProfileDto createAccount(
      @RequestBody @Valid final CreateAccountDto createAccountDto)
      throws UserAllreadyExistsException {
    final User user = userService.createAccount(createAccountDto);
    return new ProfileDto(user);
  }

  @GetMapping("/own")
  public UserDto getOwnProfil() {
    final User user = userService.getCurrentUser();
    return user != null ? new UserDto(user) : null;
  }

  @GetMapping("/{userId}/picture")
  public ResponseEntity<Resource> getProfilePicture(@PathVariable final String userId)
      throws IOException, UserNotFoundException {
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
