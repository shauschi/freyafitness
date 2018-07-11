package freya.fitness.api.controller;

import freya.fitness.api.dto.CreateAccountDto;
import freya.fitness.api.dto.MessageDto;
import freya.fitness.api.dto.ProfileDto;
import freya.fitness.api.dto.UserDto;
import freya.fitness.domain.jpa.User;
import freya.fitness.service.ProfilePictureService;
import freya.fitness.service.UserService;
import freya.fitness.utils.RoleNotFoundException;
import freya.fitness.utils.Size;
import freya.fitness.utils.UserAllreadyExistsException;
import freya.fitness.utils.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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

  @PreAuthorize("hasAnyAuthority('TRAINER', 'ADMIN')")
  @GetMapping("/")
  public List<ProfileDto> getAllUsers() {
    return userService.getAllUsers().stream()
        .map(ProfileDto::new)
        .collect(Collectors.toList());
  }

  @PostMapping("/create")
  public MessageDto createAccount(
      @RequestBody @Valid final CreateAccountDto createAccountDto)
      throws UserAllreadyExistsException, RoleNotFoundException {
    userService.createAccount(createAccountDto);
    return new MessageDto("Deine Registrierung war erfolgreich.");
  }

  @PreAuthorize("hasAuthority('USER')")
  @GetMapping("/own")
  public UserDto getOwnProfil() {
    final User user = userService.getCurrentUser();
    return user != null ? new UserDto(user) : null;
  }

  @PreAuthorize("hasAnyAuthority('USER', 'TRAINER', 'ADMIN')")
  @GetMapping("/{userId}/picture/{size}")
  public ResponseEntity<Resource> getProfilePicture(
      @PathVariable final UUID userId,
      @PathVariable final Size size) throws IOException {
    final byte[] bytes = profilePictureService.getProfilePictureData(userId, size);
    return ResponseEntity.ok().body(new ByteArrayResource(bytes));
  }

  @PreAuthorize("hasAuthority('USER')")
  @PostMapping("/picture/change")
  public MessageDto changeProfilePicture(
      @RequestParam("image") final MultipartFile image) throws IOException, UserNotFoundException {
    final User user = userService.getCurrentUser();
    profilePictureService.changeProfilePicture(user.getId(), image);
    return new MessageDto("Profilbild aktualisiert");
  }

}
