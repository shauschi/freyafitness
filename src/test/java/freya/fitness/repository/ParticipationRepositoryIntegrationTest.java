package freya.fitness.repository;

import freya.fitness.TestcontainerTest;
import freya.fitness.api.dto.CreateAccountDto;
import freya.fitness.domain.jpa.Course;
import freya.fitness.domain.jpa.Membership;
import freya.fitness.domain.jpa.MembershipType;
import freya.fitness.domain.jpa.Participation;
import freya.fitness.domain.jpa.ParticipationStatus;
import freya.fitness.domain.jpa.User;
import freya.fitness.domain.jpa.Validity;
import freya.fitness.proxy.EmailProxy;
import freya.fitness.repository.jpa.CourseRepository;
import freya.fitness.repository.jpa.CourseTypeRepository;
import freya.fitness.repository.jpa.MembershipRepository;
import freya.fitness.repository.jpa.MembershipTypeRepository;
import freya.fitness.repository.jpa.ParticipationRepository;
import freya.fitness.repository.jpa.UserRepository;
import freya.fitness.service.UserService;
import freya.fitness.utils.exception.UserAllreadyExistsException;
import java.time.Duration;
import java.time.LocalDateTime;
import org.jetbrains.annotations.NotNull;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.util.TestPropertyValues;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.testcontainers.containers.PostgreSQLContainer;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;

@Category(TestcontainerTest.class)
@SpringBootTest
@RunWith(SpringRunner.class)
@ContextConfiguration(initializers = {ParticipationRepositoryIntegrationTest.Initializer.class})
public class ParticipationRepositoryIntegrationTest {

  @ClassRule
  public static PostgreSQLContainer postgreSQLContainer =
      (PostgreSQLContainer) new PostgreSQLContainer("postgres:10.4")
          .withDatabaseName("freyafitness")
          .withUsername("testuser")
          .withPassword("testpassword")
          .withStartupTimeout(Duration.ofSeconds(600));

  @Autowired
  private UserService userService;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private MembershipRepository membershipRepository;

  @Autowired
  private MembershipTypeRepository membershipTypeRepository;

  @Autowired
  private CourseRepository courseRepository;

  @Autowired
  private ParticipationRepository participationRepository;

  @MockBean
  private EmailProxy emailProxy;

  @Autowired
  private CourseTypeRepository courseTypeRepository;

  private User tobiTester;
  private User fredFoo;

  private Course baseCourseNextWeek;
  private Course baseCourseLastWeek;
  private Course teamCourseInTwoWeeks;

  @Before
  public void setUpTest() {
    participationRepository.deleteAll();
    membershipRepository.deleteAll();
    courseRepository.deleteAll();
    userRepository.deleteAll();

    tobiTester = aTestUserExists("Tobi", "Tester");
    fredFoo = aTestUserExists("Fred", "Foo");

    LocalDateTime now = LocalDateTime.now();
    baseCourseLastWeek = aCourseExists("FUN.BASE", now.minusWeeks(1));
    baseCourseNextWeek = aCourseExists("FUN.BASE", now.plusWeeks(1));
    teamCourseInTwoWeeks = aCourseExists("FUN.TEAM", now.plusWeeks(2));
  }

  @Test
  public void beingSignedInInThePastCountsAsParticipation() {
    Membership membership = aMembershipExistsFor(tobiTester);
    theUserIsSignedIn(membership, baseCourseLastWeek, LocalDateTime.now().minusDays(2));

    Long result = participationRepository.countParticipationsForMembership(membership, LocalDateTime.now());

    assertThat(result).isEqualTo(1L);
  }

  @Test
  public void beingSignedInInTheFututeCountsAsParticipation() {
    Membership membership = aMembershipExistsFor(tobiTester);
    theUserIsSignedIn(membership, baseCourseNextWeek, LocalDateTime.now().minusDays(2));

    Long result = participationRepository.countParticipationsForMembership(membership, LocalDateTime.now());

    assertThat(result).isEqualTo(1L);
  }

  @Test
  public void beingOnWaitlistInTheFutureCountsAsParticipation() {
    Membership membership = aMembershipExistsFor(tobiTester);
    theUserIsOnWaitlist(membership, baseCourseNextWeek, LocalDateTime.now().minusDays(2));

    Long result = participationRepository.countParticipationsForMembership(membership, LocalDateTime.now());

    assertThat(result).isEqualTo(1L);
  }

  @Test
  public void beingOnWaitlistInThePastDoesNotCountsAsParticipation() {
    Membership membership = aMembershipExistsFor(tobiTester);
    theUserIsOnWaitlist(membership, baseCourseLastWeek, LocalDateTime.now().minusDays(2));

    Long result = participationRepository.countParticipationsForMembership(membership, LocalDateTime.now());

    assertThat(result).isEqualTo(0L);
  }

  @Test
  public void countSignedInAndOnWaitlist() {
    Membership membership = aMembershipExistsFor(tobiTester);
    theUserIsSignedIn(membership, baseCourseNextWeek, LocalDateTime.now().minusDays(2));
    theUserIsOnWaitlist(membership, teamCourseInTwoWeeks, LocalDateTime.now().minusDays(1));
    theUserIsOnWaitlist(membership, baseCourseLastWeek, LocalDateTime.now().minusDays(1));

    Long result = participationRepository.countParticipationsForMembership(membership, LocalDateTime.now());

    assertThat(result).isEqualTo(2L);
  }

  @Test
  public void beingSignedOutDoesNotCount() {
    Membership membership = aMembershipExistsFor(tobiTester);
    theUserIsSignedOut(membership, baseCourseNextWeek, LocalDateTime.now().minusDays(2));
    theUserIsSignedOut(membership, teamCourseInTwoWeeks, LocalDateTime.now().minusDays(1));
    theUserIsSignedOut(membership, baseCourseLastWeek, LocalDateTime.now().minusDays(1));

    Long result = participationRepository.countParticipationsForMembership(membership, LocalDateTime.now());

    assertThat(result).isEqualTo(0L);
  }

  @Test
  public void doNotCountParticipationsOfOtherUsers() {
    Membership membershipTobi = aMembershipExistsFor(tobiTester);
    theUserIsSignedIn(membershipTobi, baseCourseNextWeek, LocalDateTime.now().minusDays(2));
    theUserIsOnWaitlist(membershipTobi, teamCourseInTwoWeeks, LocalDateTime.now().minusDays(1));

    Membership membershipFred = aMembershipExistsFor(fredFoo);
    theUserIsSignedIn(membershipFred, baseCourseNextWeek, LocalDateTime.now().minusDays(7));
    theUserIsSignedIn(membershipFred, teamCourseInTwoWeeks, LocalDateTime.now().minusDays(10));
    theUserIsSignedIn(membershipFred, baseCourseLastWeek, LocalDateTime.now().minusDays(12));

    Long resultTobi = participationRepository.countParticipationsForMembership(membershipTobi, LocalDateTime.now());
    Long resultFred = participationRepository.countParticipationsForMembership(membershipFred, LocalDateTime.now());

    assertThat(resultTobi).isEqualTo(2L);
    assertThat(resultFred).isEqualTo(3L);
  }

  static class Initializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {
    public void initialize(ConfigurableApplicationContext configurableApplicationContext) {
      TestPropertyValues.of(
          "spring.datasource.driverClass=org.postgresql.Driver",
          "spring.datasource.url=" + postgreSQLContainer.getJdbcUrl(),
          "spring.datasource.username=" + postgreSQLContainer.getUsername(),
          "spring.datasource.password=" + postgreSQLContainer.getPassword()
      ).applyTo(configurableApplicationContext.getEnvironment());
    }
  }

  private User aTestUserExists(String firstName, String lastName) {
    CreateAccountDto user = new CreateAccountDto();
    user.setFirstname(firstName);
    user.setLastname(lastName);
    user.setEmail(firstName + "." + lastName + "@freya.fitness");
    user.setPassword("1234");
    user.setMatchingPassword("1234");
    try {
      return userService.createAccount(user);
    } catch (UserAllreadyExistsException e) {
      fail("Setting up test user failed: " + e.getMessage());
      return null;
    }
  }

  private Membership aMembershipExistsFor(User user) {
    Membership membership = new Membership();
    membership.setUser(user);
    MembershipType trialMembership = membershipTypeRepository.findByKey("SUBSCRIPTION")
        .orElseThrow(() -> new RuntimeException("Did not find membership"));
    membership.setType(trialMembership);
    membership.setValidity(Validity.startNow());
    return membershipRepository.save(membership);
  }

  private Course aCourseExists(String courseTypeName, LocalDateTime start) {
    Course course = new Course();
    course.setType(courseTypeRepository.findByName(courseTypeName)
        .orElseThrow(() -> new RuntimeException("Did not find course type")));
    course.setStart(start);
    course.setMaxParticipants(12);
    return courseRepository.save(course);
  }

  private Participation theUserIsSignedIn(Membership membership, Course course, LocalDateTime signInTime) {
    return getParticipation(membership, course, signInTime, ParticipationStatus.SIGNED_IN);
  }

  private Participation theUserIsSignedOut(Membership membership, Course course, LocalDateTime signInTime) {
    return getParticipation(membership, course, signInTime, ParticipationStatus.SIGNED_OUT);
  }

  private Participation theUserIsOnWaitlist(Membership membership, Course course, LocalDateTime signInTime) {
    return getParticipation(membership, course, signInTime, ParticipationStatus.ON_WAITLIST);
  }

  @NotNull
  private Participation getParticipation(
      Membership membership,
      Course course,
      LocalDateTime signInTime,
      ParticipationStatus onWaitlist) {
    Participation participation = new Participation();
    participation.setParticipationStatus(onWaitlist);
    participation.setMembership(membership);
    participation.setCourse(course);
    participation.setSignInTime(signInTime);
    return participationRepository.save(participation);
  }

}