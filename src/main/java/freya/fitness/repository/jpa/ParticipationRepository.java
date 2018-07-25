package freya.fitness.repository.jpa;

import freya.fitness.domain.jpa.Membership;
import freya.fitness.domain.jpa.Participation;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParticipationRepository extends JpaRepository<Participation, UUID> {

  Long countByMembership(final Membership membership);

  Optional<Participation> findByMembershipUserIdAndCourseId(final UUID userId, final UUID courseId);

  List<Participation> findByMembershipUserIdAndCourseStartGreaterThanEqual(
      final UUID id, final LocalDateTime from);
}
