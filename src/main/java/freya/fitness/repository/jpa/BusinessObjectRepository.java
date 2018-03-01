package freya.fitness.repository.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@NoRepositoryBean
public interface BusinessObjectRepository<ENTITY, ID> extends JpaRepository<ENTITY, ID> {

  List<ENTITY> findByValidityFromLessThanEqualAndValidityToGreaterThanEqual(
      LocalDateTime from, LocalDateTime to);

}
