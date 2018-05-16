package freya.fitness.repository.jpa;

import freya.fitness.domain.jpa.Role;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoleRepository extends BusinessObjectRepository<Role, UUID> {

  Optional<Role> findByAuthority(final String authority);

}
