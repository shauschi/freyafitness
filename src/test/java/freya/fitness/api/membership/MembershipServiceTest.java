package freya.fitness.api.membership;

import freya.fitness.utils.exception.MembershipException;
import freya.fitness.utils.exception.MembershipNotFoundException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import static freya.fitness.TestUtils.givenMembership;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatExceptionOfType;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class})
@MockitoSettings(strictness = Strictness.LENIENT)
class MembershipServiceTest {

  @InjectMocks
  private MembershipService testee;

  @Mock
  private MembershipRepository membershipRepository;

  @Mock
  private ParticipationService participationService;

  @Test
  void shouldCallFindAllFromRepository() {
    // given
    final List<Membership> list = Arrays.asList(new Membership(), new Membership(), new Membership());
    when(membershipRepository.findAll()).thenReturn(list);

    // when
    final List<Membership> result = testee.getAllMemberships();

    // then
    assertThat(result).isEqualTo(list);
    verify(membershipRepository).findAll();
  }

  @Test
  void shouldReturnMembership() {
    // given
    final UUID id = UUID.randomUUID();
    final Membership membership = new Membership();
    when(membershipRepository.findById(id)).thenReturn(Optional.of(membership));

    // when
    final Membership result = testee.getMembership(id);

    // then
    assertThat(result).isEqualTo(membership);
    verify(membershipRepository).findById(id);
  }

  @Test
  void shouldThrowMembershipNotFoundException() {
    final UUID id = UUID.randomUUID();

    assertThatExceptionOfType(MembershipNotFoundException.class).isThrownBy(
        () -> testee.getMembership(id)
    ).withMessageContaining(id.toString());
  }


  @Test
  void shouldThrowExceptionWhenNoMembershipExists() {
    final UUID id = UUID.randomUUID();
    when(membershipRepository.findByUserId(id)).thenReturn(Collections.emptyList());

    assertThatExceptionOfType(MembershipException.class).isThrownBy(
        () -> testee.getCurrentMembershipForUser(id, LocalDateTime.now())
    ).withMessage("Keine aktive Mitgliedschaft gefunden");
  }

  @Test
  void shouldThrowExceptionWhenNoValidMembershipExists() {
    final UUID id = UUID.randomUUID();
    final Membership membership = givenMembership(false, 10);
    when(membershipRepository.findByUserId(id)).thenReturn(Collections.singletonList(membership));

    assertThatExceptionOfType(MembershipException.class).isThrownBy(
        () -> testee.getCurrentMembershipForUser(id, LocalDateTime.now())
    ).withMessage("Keine aktive Mitgliedschaft gefunden");
  }

  @Test
  void shouldThrowExceptionWhenNoValidMembershipWithFreeCapacityExists() {
    final UUID id = UUID.randomUUID();
    final Membership membership = givenMembership(true, 10);
    when(membershipRepository.findByUserId(id)).thenReturn(Collections.singletonList(membership));

    assertThatExceptionOfType(MembershipException.class).isThrownBy(
        () -> testee.getCurrentMembershipForUser(id, LocalDateTime.now())
    ).withMessage("Karte voll");
  }

  @Test
  void shouldReturnMembershipWithUnlimitedAccessFirst() throws MembershipException {
    // given
    final UUID id = UUID.randomUUID();
    final Membership membership1 = givenMembership(true, 10);
    final Membership membership2 = givenMembership(true, -1);
    final Membership membership3 = givenMembership(true, 1);
    when(membershipRepository.findByUserId(id)).thenReturn(Arrays.asList(membership1, membership2, membership3));
    when(participationService.hasFreeCapacityOnMembership(eq(membership1), any())).thenReturn(true);
    when(participationService.hasFreeCapacityOnMembership(eq(membership2), any())).thenReturn(true);
    when(participationService.hasFreeCapacityOnMembership(eq(membership3), any())).thenReturn(true);

    // when
    final Membership result = testee.getCurrentMembershipForUser(id, LocalDateTime.now());

    // then
    assertThat(result).isEqualTo(membership2);
    verify(membershipRepository).findByUserId(id);
  }

}
