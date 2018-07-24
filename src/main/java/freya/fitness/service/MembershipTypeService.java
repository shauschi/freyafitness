package freya.fitness.service;

import freya.fitness.domain.jpa.MembershipType;
import freya.fitness.repository.jpa.MembershipTypeRepository;
import freya.fitness.utils.exception.MembershipTypeNotFoundException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MembershipTypeService {

  private final MembershipTypeRepository membershipTypeRepository;

  @Autowired
  public MembershipTypeService(final MembershipTypeRepository membershipTypeRepository) {
    this.membershipTypeRepository = membershipTypeRepository;
  }

  public List<MembershipType> getAllMembershipTypes() {
    return membershipTypeRepository.findAll();
  }

  public MembershipType getMembershipType(final UUID id) throws MembershipTypeNotFoundException {
    return membershipTypeRepository.findById(id)
        .orElseThrow(() -> MembershipTypeNotFoundException.withId(id));
  }

  public List<MembershipType> getValidMembershipTypes() {
    final LocalDateTime now = LocalDateTime.now();
    return membershipTypeRepository
        .findByValidityFromLessThanEqualAndValidityToGreaterThanEqual(now, now);
  }
}
