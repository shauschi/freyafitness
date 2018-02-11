package freya.fitness.repository;

import freya.fitness.domain.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {

  List<News> findByValidityFromLessThanEqualAndValidityToGreaterThanEqual(
      LocalDateTime from, LocalDateTime to);
}
