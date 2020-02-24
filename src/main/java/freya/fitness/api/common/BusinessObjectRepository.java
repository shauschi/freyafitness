package freya.fitness.api.common;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface BusinessObjectRepository<ENTITY, ID> extends JpaRepository<ENTITY, ID> {

  List<ENTITY> findByValidityFromLessThanEqualAndValidityToGreaterThanEqual(
      LocalDateTime from, LocalDateTime to);

}
