package freya.fitness.repository.jpa;

import freya.fitness.domain.jpa.Membership;
import java.util.Arrays;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MembershipRepository extends JpaRepository<Membership, UUID> {

  List<Membership> findByUserId(UUID userId);

}
