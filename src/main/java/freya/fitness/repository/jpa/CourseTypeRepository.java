package freya.fitness.repository.jpa;

import freya.fitness.domain.jpa.CourseType;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseTypeRepository extends BusinessObjectRepository<CourseType, String> {
  
}
