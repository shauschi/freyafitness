package freya.fitness.repository.jpa;

import freya.fitness.domain.jpa.UserPreference;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserPreferencesRepository extends JpaRepository<UserPreference, UUID> {

  Optional<UserPreference> findByKeyAndUserId(final String key, final UUID userId);
}
