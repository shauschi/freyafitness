package freya.fitness.repository.jpa;

import freya.fitness.domain.jpa.News;
import org.springframework.stereotype.Repository;

@Repository
public interface NewsRepository extends BusinessObjectRepository<News, String> {

}
