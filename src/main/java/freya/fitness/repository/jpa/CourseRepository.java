package freya.fitness.repository.jpa;

import freya.fitness.domain.jpa.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {

  List<Course> findByStartGreaterThanEqual(LocalDateTime timestamp);

  List<Course> findByStartBetween(LocalDateTime from, LocalDateTime to);

}
