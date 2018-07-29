package freya.fitness.service;

import freya.fitness.domain.jpa.Membership;
import freya.fitness.repository.jpa.MembershipRepository;
import freya.fitness.utils.exception.MembershipException;
import freya.fitness.utils.exception.MembershipNotFoundException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.tomcat.jni.Local;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MembershipService {

  private static final Logger LOGGER = LogManager.getLogger(MembershipService.class);

  private final MembershipRepository membershipRepository;
  private final ParticipationService participationService;

  @Autowired
  public MembershipService(final MembershipRepository membershipRepository,
                           final ParticipationService participationService) {
    this.membershipRepository = membershipRepository;
    this.participationService = participationService;
  }

  public List<Membership> getAllMemberships() {
    return membershipRepository.findAll();
  }

  public Membership getMembership(final UUID id) throws MembershipNotFoundException {
    return membershipRepository.findById(id).orElseThrow(() -> MembershipNotFoundException.withId(id));
  }

  public Membership saveMembership(final Membership membership) {
    return membershipRepository.save(membership);
  }

  public List<Membership> getValidMembershipsForUser(final UUID userId) {
    return this.getValidMembershipsForUser(userId, LocalDateTime.now());
  }

  public List<Membership> getValidMembershipsForUser(final UUID userId, final LocalDateTime dateTime) {
    return membershipRepository.findByUserId(userId).stream()
        .filter(membership -> membership.isValid(dateTime))
        .collect(Collectors.toList());
  }

  public Membership getCurrentMembershipForUser(final UUID userId, final LocalDateTime dateTime)
      throws MembershipException {
    final List<Membership> memberships = getValidMembershipsForUser(userId, dateTime);
    if (memberships.isEmpty()) {
      LOGGER.debug("Keine aktive Mitgliedschaft gefunden für User %s", userId);
      throw new MembershipException("Keine aktive Mitgliedschaft gefunden");
    }

    return memberships.stream()
        .filter(membership -> participationService.hasFreeCapacityOnMembership(membership, dateTime))
        .min(Comparator.comparingInt(m -> m.getType().getMaxParticipations()))
        .orElseThrow(() -> new MembershipException(
            String.format("Karte%s voll", memberships.size() == 1 ? "" : "n")));
  }

}
