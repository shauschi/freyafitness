package freya.fitness.repository.jpa;

import freya.fitness.domain.jpa.UserPreference;
import java.util.Optional;
import java.util.UUID;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserPreferencesRepository extends JpaRepository<UserPreference, UUID> {

  Optional<UserPreference> findByKey(final String key);
}
