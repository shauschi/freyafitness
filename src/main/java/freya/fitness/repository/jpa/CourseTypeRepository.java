package freya.fitness.repository.jpa;

import freya.fitness.domain.jpa.CourseType;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CourseTypeRepository extends BusinessObjectRepository<CourseType, UUID> {
  
}
