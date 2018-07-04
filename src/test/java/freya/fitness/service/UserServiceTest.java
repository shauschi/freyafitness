package freya.fitness.service;

import freya.fitness.domain.jpa.Role;
import freya.fitness.domain.jpa.User;
import freya.fitness.api.dto.CreateAccountDto;
import freya.fitness.repository.jpa.RoleRepository;
import freya.fitness.repository.jpa.UserRepository;
import freya.fitness.utils.RoleNotFoundException;
import freya.fitness.utils.UserAllreadyExistsException;
import freya.fitness.utils.UserNotFoundException;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class UserServiceTest {

  @InjectMocks
  private UserService testee;

  @Mock
  private UserRepository userRepository;

  @Mock
  private PasswordEncoder passwordEncoder;

  @Mock
  private RoleRepository roleRepository;

  @Rule
  public ExpectedException expectedException = ExpectedException.none();

  private User user;
  private Role roleUser;
  private UUID uuid = UUID.randomUUID();

  @Before
  public void setUp() {
    user = new User();
    user.setId(uuid);
    user.setFirstName("Test");
    user.setFamilyName("User");
    user.setEmail("test.user@test.mail");
    user.setPassword("any");

    roleUser = new Role();
    roleUser.setAuthority("USER");

    when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
    when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
    when(passwordEncoder.encode(any())).thenAnswer(answer -> answer.getArgument(0));
    when(roleRepository.findByAuthority("USER"))
        .thenReturn(Optional.of(roleUser));
  }

  @Test
  public void test_getUser_userNotFound_idIsNull() throws UserNotFoundException {
    expectedException.expect(UserNotFoundException.class);

    testee.getUser(null);
  }

  @Test
  public void test_getUser_userNotFound() throws UserNotFoundException {
    expectedException.expect(UserNotFoundException.class);

    testee.getUser(UUID.randomUUID());
  }

  @Test
  public void test_getUser() throws UserNotFoundException {
    User result = testee.getUser(uuid);

    assertThat(result, equalTo(user));
  }

  @Test
  public void test_getUserByEmail_userNotFound_emailIsNull() throws UserNotFoundException {
    expectedException.expect(UserNotFoundException.class);

    testee.getUserByEmail(null);
  }

  @Test
  public void test_getUserByEmail_userNotFound() throws UserNotFoundException {
    expectedException.expect(UserNotFoundException.class);

    testee.getUserByEmail("invalid@test.mail");
  }

  @Test
  public void test_getUserByEmail() throws UserNotFoundException {
    User result = testee.getUserByEmail("test.user@test.mail");

    assertThat(result, equalTo(user));
  }

  @Test
  public void test_createAccount_userAllreadyExists()
      throws UserAllreadyExistsException, RoleNotFoundException {
    expectedException.expect(UserAllreadyExistsException.class);

    testee.createAccount(createAccountDto("any", "any", user.getEmail(), "any"));
  }

  @Test
  public void test_createAccount()
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

    assertThat(result.getFirstName(), equalTo(newUser.getFirstName()));
    assertThat(result.getFamilyName(), equalTo(newUser.getFamilyName()));
    assertThat(result.getEmail(), equalTo(newUser.getEmail()));
    assertThat(result.getPassword(), equalTo(newUser.getPassword()));
    List<Role> roles = result.getRoles();
    assertThat(roles, hasSize(1));
    assertThat(roles.get(0), equalTo(roleUser));

    // Beim Speichern wurde die Rolle ergänzt
    newUser.setRoles(roles);

    verify(userRepository).save(argThat(user -> user.getFirstName().equals(newUser.getFirstName())));
  }

  @Test
  public void test_saveUser() {
    final User user = new User();
    when(userRepository.save(any())).thenAnswer(invocation -> invocation.getArguments()[0]);

    User result = testee.saveUser(user);

    verify(userRepository).save(user);
    assertThat(result, equalTo(user));
  }

  @Test
  public void test_loadUserByUsername_userNotFound() {
    expectedException.expect(UsernameNotFoundException.class);
    when(userRepository.findByEmail(any())).thenReturn(Optional.empty());

    testee.loadUserByUsername("any@test.mail");
  }

  @Test
  public void test_loadUserByUsername() {
    final String username = "any@test.mail";
    final User user = new User();
    user.setEmail(username);
    user.setPassword("test_password");
    user.setRoles(Collections.singletonList(new Role()));
    when(userRepository.findByEmail(username)).thenReturn(Optional.of(user));

    UserDetails result = testee.loadUserByUsername(username);

    verify(userRepository).findByEmail(username);
    assertThat(result, notNullValue());
    assertThat(result.getUsername(), equalTo(username));
    assertThat(result.getPassword(), equalTo(user.getPassword()));
    assertThat(result.getAuthorities().size(), equalTo(1));
  }

  @Test
  public void test_getCurrentUser_anonymousUser() {
    Authentication auth = mock(Authentication.class);
    when(auth.getPrincipal()).thenReturn("anonymousUser");
    SecurityContext mockContext = mock(SecurityContext.class);
    SecurityContextHolder.setContext(mockContext);
    when(mockContext.getAuthentication()).thenReturn(auth);

    User result = testee.getCurrentUser();

    assertThat(result, nullValue());
  }

  @Test
  public void test_getCurrentUser() {
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

    assertThat(result, equalTo(user));
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