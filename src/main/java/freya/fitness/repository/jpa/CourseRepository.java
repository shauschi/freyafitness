package freya.fitness.repository.jpa;

import freya.fitness.domain.jpa.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

  List<Course> findByStartGreaterThanEqual(LocalDateTime timestamp);

  List<Course> findByStartLessThanEqual(LocalDateTime timestamp);

  List<Course> findByStartBetween(LocalDateTime from, LocalDateTime to);

}
