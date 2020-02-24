package freya.fitness.api.user;

import freya.fitness.api.common.BusinessObjectRepository;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends BusinessObjectRepository<Role, UUID> {

  Optional<Role> findByAuthority(final String authority);

}
