package freya.fitness.repository.jpa;

import freya.fitness.domain.jpa.News;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface NewsRepository extends BusinessObjectRepository<News, UUID> {

}
