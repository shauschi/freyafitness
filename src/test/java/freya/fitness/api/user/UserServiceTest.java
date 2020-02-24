package freya.fitness.api.user;

import freya.fitness.proxy.EmailProxy;
import freya.fitness.utils.exception.RoleNotFoundException;
import freya.fitness.utils.exception.UserAllreadyExistsException;
import freya.fitness.utils.exception.UserNotFoundException;
import java.util.Collections;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatExceptionOfType;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class})
@MockitoSettings(strictness = Strictness.LENIENT)
class UserServiceTest {

  @InjectMocks
  private UserService testee;

  @Mock
  private UserRepository userRepository;

  @Mock
  private PasswordEncoder passwordEncoder;

  @Mock
  private RoleRepository roleRepository;

  @Mock
  private EmailProxy emailProxy;

  private User user;
  private Role roleUser;
  private UUID uuid = UUID.randomUUID();

  @BeforeEach
  void setUp() {
    user = new User();
    user.setId(uuid);
    user.setFirstName("Test");
    user.setFamilyName("User");
    user.setEmail("test.user@test.mail");
    user.setPassword("any");

    roleUser = new Role();
    roleUser.setAuthority("USER");

    when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
    when(userRepository.findByEmailIgnoreCase(user.getEmail())).thenReturn(Optional.of(user));
    when(passwordEncoder.encode(any())).thenAnswer(answer -> answer.getArgument(0));
    when(roleRepository.findByAuthority("USER"))
        .thenReturn(Optional.of(roleUser));
  }

  @Test
  void test_getUser_userNotFound_idIsNull() {
    assertThatExceptionOfType(UserNotFoundException.class).isThrownBy(
        () -> testee.getUser(null)
    );
  }

  @Test
  void test_getUser_userNotFound() {
    assertThatExceptionOfType(UserNotFoundException.class).isThrownBy(
        () -> testee.getUser(UUID.randomUUID())
    );
  }

  @Test
  void test_getUser() {
    User result = testee.getUser(uuid);

    assertThat(result).isEqualTo(user);
  }

  @Test
  void test_getUserByEmail_userNotFound_emailIsNull() {
    assertThatExceptionOfType(UserNotFoundException.class).isThrownBy(
        () -> testee.getUserByEmail(null)
    );
  }

  @Test
  void test_getUserByEmail_userNotFound() {
    assertThatExceptionOfType(UserNotFoundException.class).isThrownBy(
        () -> testee.getUserByEmail("invalid@test.mail")
    );
  }

  @Test
  void test_getUserByEmail() throws UserNotFoundException {
    User result = testee.getUserByEmail("test.user@test.mail");

    assertThat(result).isEqualTo(user);
  }

  @Test
  void test_createAccount_userAllreadyExists() {
    assertThatExceptionOfType(UserAllreadyExistsException.class).isThrownBy(
        () -> testee.createAccount(createAccountDto("any", "any", user.getEmail(), "any"))
    );
  }

  @Test
  void test_createAccount()
      throws UserAllreadyExistsException, RoleNotFoundException {
    final User newUser = new User();
    newUser.setFirstName("New");
    newUser.setFamilyName("User");
    newUser.setEmail("test2.mail@test.mail");
    newUser.setPassword("any");
    when(userRepository.save(any())).thenAnswer(invocation -> invocation.getArguments()[0]);

    User result = testee.createAccount(createAccountDto(
        newUser.getFirstName(), newUser.getFamilyName(),
        newUser.getEmail(), newUser.getPassword()));

    assertThat(result.getFirstName()).isEqualTo(newUser.getFirstName());
    assertThat(result.getFamilyName()).isEqualTo(newUser.getFamilyName());
    assertThat(result.getEmail()).isEqualTo(newUser.getEmail());
    assertThat(result.getPassword()).isEqualTo(newUser.getPassword());
    Set<Role> roles = result.getRoles();
    assertThat(roles).hasSize(1)
        .containsExactly(roleUser);

    // Beim Speichern wurde die Rolle ergänzt
    newUser.setRoles(roles);
    verify(userRepository).save(argThat(user -> user.getFirstName().equals(newUser.getFirstName())));
  }

  @Test
  void test_saveUser() {
    final User user = new User();
    when(userRepository.save(any())).thenAnswer(invocation -> invocation.getArguments()[0]);

    User result = testee.saveUser(user);

    verify(userRepository).save(user);
    assertThat(result).isEqualTo(user);
  }

  @Test
  void test_loadUserByUsername_userNotFound() {
    when(userRepository.findByEmailIgnoreCase(any())).thenReturn(Optional.empty());

    assertThatExceptionOfType(UsernameNotFoundException.class).isThrownBy(
        () -> testee.loadUserByUsername("any@test.mail")
    );
  }

  @Test
  void test_loadUserByUsername() {
    final String username = "any@test.mail";
    final User user = new User();
    user.setEmail(username);
    user.setPassword("test_password");
    user.setRoles(Collections.singleton(new Role()));
    when(userRepository.findByEmailIgnoreCase(username)).thenReturn(Optional.of(user));

    UserDetails result = testee.loadUserByUsername(username);

    verify(userRepository).findByEmailIgnoreCase(username);
    assertThat(result).isNotNull();
    assertThat(result.getUsername()).isEqualTo(username);
    assertThat(result.getPassword()).isEqualTo(user.getPassword());
    assertThat(result.getAuthorities()).hasSize(1);
  }

  @Test
  void test_getCurrentUser_anonymousUser() {
    Authentication auth = mock(Authentication.class);
    when(auth.getPrincipal()).thenReturn("anonymousUser");
    SecurityContext mockContext = mock(SecurityContext.class);
    SecurityContextHolder.setContext(mockContext);
    when(mockContext.getAuthentication()).thenReturn(auth);

    User result = testee.getCurrentUser();

    assertThat(result).isNull();
  }

  @Test
  void test_getCurrentUser() {
    org.springframework.security.core.userdetails.User principal =
        new org.springframework.security.core.userdetails.User(
            user.getEmail(),
            user.getPassword(),
            Collections.singletonList(new SimpleGrantedAuthority("USER")));
    Authentication auth = mock(Authentication.class);
    when(auth.getPrincipal()).thenReturn(principal);
    SecurityContext mockContext = mock(SecurityContext.class);
    SecurityContextHolder.setContext(mockContext);
    when(mockContext.getAuthentication()).thenReturn(auth);

    User result = testee.getCurrentUser();

    assertThat(result).isEqualTo(user);
  }

  private CreateAccountDto createAccountDto(
      final String firstname, final String lastname, final String email, final String password) {
    final CreateAccountDto createAccountDto = new CreateAccountDto();
    createAccountDto.setFirstname(firstname);
    createAccountDto.setLastname(lastname);
    createAccountDto.setEmail(email);
    createAccountDto.setPassword(password);
    return createAccountDto;
  }

}
