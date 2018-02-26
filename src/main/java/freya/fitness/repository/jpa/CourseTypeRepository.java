package freya.fitness.repository.jpa;

import freya.fitness.domain.jpa.CourseType;
import freya.fitness.domain.jpa.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CourseTypeRepository extends BusinessObjectRepository<CourseType, Long> {
  
}
