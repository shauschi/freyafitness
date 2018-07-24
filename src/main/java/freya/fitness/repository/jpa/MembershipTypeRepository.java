package freya.fitness.repository.jpa;

import freya.fitness.domain.jpa.MembershipType;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MembershipTypeRepository extends JpaRepository<MembershipType, UUID> {

  Optional<MembershipType> findByKey(final String key);

  List<MembershipType> findByValidityFromLessThanEqualAndValidityToGreaterThanEqual(
      final LocalDateTime now, final LocalDateTime now1);
}
