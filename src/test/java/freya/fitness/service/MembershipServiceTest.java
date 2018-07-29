package freya.fitness.service;

import freya.fitness.domain.jpa.Membership;
import freya.fitness.repository.jpa.MembershipRepository;
import freya.fitness.utils.exception.MembershipException;
import freya.fitness.utils.exception.MembershipNotFoundException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import static freya.fitness.TestUtils.givenMembership;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class MembershipServiceTest {

  @InjectMocks
  private MembershipService testee;

  @Mock
  private MembershipRepository membershipRepository;

  @Mock
  private ParticipationService participationService;

  @Rule
  public ExpectedException expectedException = ExpectedException.none();

  @Test
  public void shouldCallFindAllFromRepository() {
    // given
    final List<Membership> list = Arrays.asList(new Membership(), new Membership(), new Membership());
    when(membershipRepository.findAll()).thenReturn(list);

    // when
    final List<Membership> result = testee.getAllMemberships();

    // then
    assertThat(result, is(list));
    verify(membershipRepository).findAll();
  }

  @Test
  public void shouldReturnMembership() {
    // given
    final UUID id = UUID.randomUUID();
    final Membership membership = new Membership();
    when(membershipRepository.findById(id)).thenReturn(Optional.of(membership));

    // when
    final Membership result = testee.getMembership(id);

    // then
    assertThat(result, is(membership));
    verify(membershipRepository).findById(id);
  }

  @Test
  public void shouldThrowMembershipNotFoundException() {
    // given
    final UUID id = UUID.randomUUID();

    // expected exception
    expectedException.expect(MembershipNotFoundException.class);
    expectedException.expectMessage(containsString(id.toString()));

    // when
    testee.getMembership(id);

    // then
    // see expected exception
  }



  @Test
  public void shouldThrowExceptionWhenNoMembershipExists() throws MembershipException {
    // expected exception
    expectedException.expect(MembershipException.class);
    expectedException.expectMessage("Keine aktive Mitgliedschaft gefunden");

    // given
    final UUID id = UUID.randomUUID();
    when(membershipRepository.findByUserId(id)).thenReturn(Collections.emptyList());

    // when
    testee.getCurrentMembershipForUser(id, LocalDateTime.now());

    // then
    // see expected exception
  }

  @Test
  public void shouldThrowExceptionWhenNoValidMembershipExists() throws MembershipException {
    // expected exception
    expectedException.expect(MembershipException.class);
    expectedException.expectMessage("Keine aktive Mitgliedschaft gefunden");

    // given
    final UUID id = UUID.randomUUID();
    final Membership membership = givenMembership(false, 10);
    when(membershipRepository.findByUserId(id)).thenReturn(Collections.singletonList(membership));

    // when
    testee.getCurrentMembershipForUser(id, LocalDateTime.now());

    // then
    // see expected exception
  }

  @Test
  public void shouldThrowExceptionWhenNoValidMembershipWithFreeCapacityExists() throws MembershipException {
    // expected exception
    expectedException.expect(MembershipException.class);
    expectedException.expectMessage("Karte voll");

    // given
    final UUID id = UUID.randomUUID();
    final Membership membership = givenMembership(true, 10);
    when(membershipRepository.findByUserId(id)).thenReturn(Collections.singletonList(membership));

    // when
    testee.getCurrentMembershipForUser(id, LocalDateTime.now());

    // then
    // see expected exception
  }

  @Test
  public void shouldReturnMembershipWithUnlimitedAccessFirst() throws MembershipException {
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
    assertThat(result, is(membership2));
    verify(membershipRepository).findByUserId(id);
  }

}