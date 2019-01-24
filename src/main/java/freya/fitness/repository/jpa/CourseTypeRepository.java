package freya.fitness.repository.jpa;

import freya.fitness.domain.jpa.CourseType;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseTypeRepository extends BusinessObjectRepository<CourseType, UUID> {

  Optional<CourseType> findByName(String name);

}
