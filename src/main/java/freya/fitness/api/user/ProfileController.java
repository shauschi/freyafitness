package freya.fitness.api.user;

import freya.fitness.api.common.MessageDto;
import freya.fitness.api.common.ProfileDto;
import freya.fitness.utils.Size;
import freya.fitness.utils.exception.RoleNotFoundException;
import freya.fitness.utils.exception.UserAllreadyExistsException;
import freya.fitness.utils.exception.UserNotFoundException;
import java.io.IOException;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
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

@RestController
@RequestMapping("/profile")
public class ProfileController {

  private final UserService userService;
  private final ProfilePictureService profilePictureService;
  private final UserMapper userMapper;

  @Autowired
  public ProfileController(final UserService userService,
                           final ProfilePictureService profilePictureService,
                           final UserMapper userMapper) {
    this.userService = userService;
    this.profilePictureService = profilePictureService;
    this.userMapper = userMapper;
  }

  @PreAuthorize("hasAnyAuthority('TRAINER', 'ADMIN')")
  @GetMapping("/")
  public List<ProfileDto> getAllUsers() {
    return userService.getAllUsers().stream()
        .map(ProfileDto::new)
        .sorted(Comparator.comparing(ProfileDto::getFirstname))
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
    return userMapper.map(user);
  }

  @PreAuthorize("hasAnyAuthority('USER', 'TRAINER', 'ADMIN')")
  @GetMapping("/{userId}/picture/{size}")
  public ResponseEntity<Resource> getProfilePicture(
      @PathVariable final UUID userId,
      @PathVariable final Size size) throws IOException {
    final byte[] bytes = profilePictureService.getProfilePictureData(userId, size);
    if (bytes != null) {
      return ResponseEntity.ok().body(new ByteArrayResource(bytes));
    } else {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
  }

  @PreAuthorize("hasAuthority('USER')")
  @PostMapping("/picture/change")
  public MessageDto changeProfilePicture(
      @RequestParam("image") final MultipartFile image) throws IOException, UserNotFoundException {
    final User user = userService.getCurrentUser();
    profilePictureService.changeProfilePicture(user, image);
    return new MessageDto("Profilbild aktualisiert");
  }

}
