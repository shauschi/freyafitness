package freya.fitness.repository.jpa;

import freya.fitness.domain.jpa.Membership;
import freya.fitness.domain.jpa.Participation;
import freya.fitness.domain.jpa.ParticipationStatus;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ParticipationRepository extends JpaRepository<Participation, UUID> {

  @Query("SELECT COUNT(p) FROM Participation p"
      + " WHERE p.membership=:membership"
      + " AND (p.participationStatus='SIGNED_IN'"
      + " OR (p.participationStatus='ON_WAITLIST' AND p.course.start>:localDateTime))")
  Long countParticipationsForMembership(
      @Param("membership") final Membership membership,
      @Param("localDateTime") final LocalDateTime localDateTime);

  Long countByMembership(final Membership membership);

  Optional<Participation> findByMembershipUserIdAndCourseId(final UUID userId, final UUID courseId);

  List<Participation> findByMembershipUserIdAndCourseStartBetweenAndParticipationStatus(
      final UUID id, final LocalDateTime from, final LocalDateTime to, final ParticipationStatus participationStatus);

  List<Participation> findByMembershipId(final UUID membershipId);

  List<Participation> findByCourseId(final UUID courseId);

  void deleteByCourseId(final UUID courseId);
}
