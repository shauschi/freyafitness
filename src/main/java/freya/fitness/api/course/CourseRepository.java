package freya.fitness.api.course;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {

  List<Course> findByStartGreaterThanEqual(LocalDateTime timestamp);

  List<Course> findByStartBetween(LocalDateTime from, LocalDateTime to);

}
