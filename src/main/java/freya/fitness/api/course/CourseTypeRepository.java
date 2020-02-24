package freya.fitness.api.course;

import freya.fitness.api.common.BusinessObjectRepository;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseTypeRepository extends BusinessObjectRepository<CourseType, UUID> {

  Optional<CourseType> findByName(String name);

}
